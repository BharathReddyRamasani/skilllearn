import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface Course { id: string; title: string; description?: string | null }
interface Module { id: string; course_id: string; title: string; position: number }
interface Lesson { id: string; module_id: string; title: string; content: string | null; position: number }

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);

  const lessonsByModule = useMemo(() => {
    const map: Record<string, Lesson[]> = {};
    for (const l of lessons) {
      if (!map[l.module_id]) map[l.module_id] = [];
      map[l.module_id].push(l);
    }
    for (const key of Object.keys(map)) map[key].sort((a, b) => a.position - b.position);
    return map;
  }, [lessons]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
const { data: c } = await supabase.from("courses").select("*").eq("id", id).maybeSingle();
const { data: mods } = await supabase.from("modules").select("*").eq("course_id", id).order("position", { ascending: true });
        if (!c) {
          toast({ title: "Course not found" });
          navigate("/courses", { replace: true });
          return;
        }
        setCourse(c as Course);
        setModules((mods || []) as Module[]);

        let allLessons: Lesson[] = [];
        if (mods && mods.length > 0) {
          const moduleIds = mods.map((m: any) => m.id);
          const { data: lessonsData } = await supabase
            .from("lessons")
            .select("*")
            .in("module_id", moduleIds)
            .order("position", { ascending: true });
          allLessons = (lessonsData || []) as Lesson[];
        }
        setLessons(allLessons);

const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData.session?.user.id;
        if (userId) {
          const { data: enrollment } = await supabase
            .from("enrollments")
            .select("id")
            .eq("user_id", userId)
            .eq("course_id", id)
            .maybeSingle();
          setEnrolled(!!enrollment);
        }
      } catch (e: any) {
        console.error(e);
        toast({ title: "Failed to load course", description: e.message });
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  const handleEnroll = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({ title: "Please sign in", description: "You need an account to enroll." });
      navigate("/auth");
      return;
    }
    try {
      const { error } = await supabase.from("enrollments").insert({ user_id: session.user.id, course_id: id });
      if (error) throw error;
      setEnrolled(true);
      toast({ title: "Enrolled", description: "You're enrolled in this course." });
    } catch (e: any) {
      toast({ title: "Enroll failed", description: e.message });
    }
  };

  const markLessonComplete = async (lessonId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    try {
      const { error } = await supabase
        .from("lesson_progress")
        .upsert({
          user_id: session.user.id,
          lesson_id: lessonId,
          status: "completed",
          completed_at: new Date().toISOString(),
        }, { onConflict: "user_id,lesson_id" });
      if (error) throw error;
      toast({ title: "Marked complete" });
    } catch (e: any) {
      toast({ title: "Update failed", description: e.message });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-5xl mx-auto px-4 py-8">
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <>
            <header className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{course?.title}</h1>
              <p className="text-muted-foreground mb-4">{course?.description}</p>
              {!enrolled ? (
                <Button onClick={handleEnroll}>Enroll</Button>
              ) : (
                <Badge variant="secondary">Enrolled</Badge>
              )}
            </header>

            <section>
              {modules.length === 0 ? (
                <Card className="p-6">
                  <p className="text-muted-foreground">No modules available.</p>
                </Card>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {modules.map((m) => (
                    <AccordionItem key={m.id} value={m.id}>
                      <AccordionTrigger>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground">Module {m.position}</span>
                          <span className="font-medium">{m.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3">
                          {(lessonsByModule[m.id] || []).map((l) => (
                            <Card key={l.id} className="p-4 flex items-start justify-between">
                              <div>
                                <h3 className="font-medium">{l.title}</h3>
                                <p className="text-sm text-muted-foreground whitespace-pre-line">{l.content || "No content yet."}</p>
                              </div>
                              <Button size="sm" onClick={() => markLessonComplete(l.id)}>Mark complete</Button>
                            </Card>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default CourseDetail;
