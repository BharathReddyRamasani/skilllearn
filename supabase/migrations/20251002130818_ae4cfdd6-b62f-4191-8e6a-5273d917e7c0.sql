-- Create skills table if not exists
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  difficulty NUMERIC NOT NULL,
  estimated_hours INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create skill_dependencies table if not exists
CREATE TABLE IF NOT EXISTS public.skill_dependencies (
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  prerequisite_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  weight NUMERIC DEFAULT 1.0,
  PRIMARY KEY (skill_id, prerequisite_id)
);

-- Create user_skill_graph table if not exists
CREATE TABLE IF NOT EXISTS public.user_skill_graph (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  mastery_level INTEGER DEFAULT 0,
  is_unlocked BOOLEAN DEFAULT false,
  last_practiced TIMESTAMPTZ,
  reinforcement_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, skill_id)
);

-- Create skill_clusters table if not exists
CREATE TABLE IF NOT EXISTS public.skill_clusters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  career_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create skill_cluster_mapping table if not exists
CREATE TABLE IF NOT EXISTS public.skill_cluster_mapping (
  cluster_id UUID NOT NULL REFERENCES public.skill_clusters(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  PRIMARY KEY (cluster_id, skill_id)
);

-- Create graph_recommendations table if not exists
CREATE TABLE IF NOT EXISTS public.graph_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  score NUMERIC NOT NULL,
  reason TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, skill_id)
);

-- Enable RLS
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skill_graph ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_cluster_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.graph_recommendations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate
DO $$ BEGIN
  DROP POLICY IF EXISTS "Allow authenticated read access to skills" ON public.skills;
  CREATE POLICY "Allow authenticated read access to skills"
    ON public.skills FOR SELECT
    TO authenticated
    USING (true);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Allow authenticated read access to dependencies" ON public.skill_dependencies;
  CREATE POLICY "Allow authenticated read access to dependencies"
    ON public.skill_dependencies FOR SELECT
    TO authenticated
    USING (true);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view their own skill graph" ON public.user_skill_graph;
  CREATE POLICY "Users can view their own skill graph"
    ON public.user_skill_graph FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can insert their own skill graph" ON public.user_skill_graph;
  CREATE POLICY "Users can insert their own skill graph"
    ON public.user_skill_graph FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can update their own skill graph" ON public.user_skill_graph;
  CREATE POLICY "Users can update their own skill graph"
    ON public.user_skill_graph FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Allow authenticated read access to clusters" ON public.skill_clusters;
  CREATE POLICY "Allow authenticated read access to clusters"
    ON public.skill_clusters FOR SELECT
    TO authenticated
    USING (true);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Allow authenticated read access to cluster mapping" ON public.skill_cluster_mapping;
  CREATE POLICY "Allow authenticated read access to cluster mapping"
    ON public.skill_cluster_mapping FOR SELECT
    TO authenticated
    USING (true);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view their own recommendations" ON public.graph_recommendations;
  CREATE POLICY "Users can view their own recommendations"
    ON public.graph_recommendations FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_skill_graph_user_id ON public.user_skill_graph(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skill_graph_skill_id ON public.user_skill_graph(skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_dependencies_skill_id ON public.skill_dependencies(skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_dependencies_prerequisite_id ON public.skill_dependencies(prerequisite_id);
CREATE INDEX IF NOT EXISTS idx_graph_recommendations_user_id ON public.graph_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_skills_category ON public.skills(category);

-- Insert initial skill data
INSERT INTO public.skills (name, description, category, difficulty, estimated_hours) 
SELECT * FROM (VALUES
  ('HTML & CSS Basics', 'Core web markup and styling', 'Frontend', 1, 20),
  ('JavaScript Fundamentals', 'Core JavaScript programming', 'Programming', 2, 40),
  ('React Basics', 'Component-based UI development', 'Frontend', 3, 60),
  ('TypeScript', 'Typed JavaScript superset', 'Programming', 4, 40),
  ('Advanced React', 'Hooks, context, performance', 'Frontend', 5, 50),
  ('Node.js', 'Server-side JavaScript', 'Backend', 3, 50),
  ('Express.js', 'Web framework for Node.js', 'Backend', 4, 30),
  ('PostgreSQL', 'Relational database management', 'Backend', 4, 40),
  ('REST API Design', 'RESTful API architecture', 'Backend', 3, 30),
  ('Git & Version Control', 'Source code management', 'DevOps', 2, 20),
  ('Docker Basics', 'Containerization fundamentals', 'DevOps', 4, 30),
  ('AWS Fundamentals', 'Cloud computing basics', 'DevOps', 5, 50),
  ('Python Basics', 'Core Python programming', 'Programming', 2, 40),
  ('Data Structures', 'Common data structures', 'Programming', 4, 60),
  ('Algorithms', 'Algorithm design & analysis', 'Programming', 5, 80)
) AS v(name, description, category, difficulty, estimated_hours)
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE skills.name = v.name);

-- Insert skill dependencies
INSERT INTO public.skill_dependencies (skill_id, prerequisite_id, weight)
SELECT 
  s1.id, s2.id, 1.0
FROM public.skills s1, public.skills s2
WHERE 
  ((s1.name = 'JavaScript Fundamentals' AND s2.name = 'HTML & CSS Basics') OR
   (s1.name = 'React Basics' AND s2.name = 'JavaScript Fundamentals') OR
   (s1.name = 'TypeScript' AND s2.name = 'JavaScript Fundamentals') OR
   (s1.name = 'Advanced React' AND s2.name = 'React Basics') OR
   (s1.name = 'Express.js' AND s2.name = 'Node.js') OR
   (s1.name = 'REST API Design' AND s2.name = 'Node.js') OR
   (s1.name = 'Docker Basics' AND s2.name = 'Git & Version Control') OR
   (s1.name = 'AWS Fundamentals' AND s2.name = 'Docker Basics') OR
   (s1.name = 'Algorithms' AND s2.name = 'Data Structures'))
  AND NOT EXISTS (
    SELECT 1 FROM public.skill_dependencies 
    WHERE skill_dependencies.skill_id = s1.id 
    AND skill_dependencies.prerequisite_id = s2.id
  );

-- Insert skill clusters
INSERT INTO public.skill_clusters (name, description, career_path)
SELECT * FROM (VALUES
  ('Full-Stack Web Developer', 'Complete web development stack', 'full-stack'),
  ('Frontend Specialist', 'UI/UX focused development', 'frontend'),
  ('Backend Engineer', 'Server-side development', 'backend'),
  ('DevOps Engineer', 'Infrastructure and deployment', 'devops')
) AS v(name, description, career_path)
WHERE NOT EXISTS (SELECT 1 FROM public.skill_clusters WHERE skill_clusters.name = v.name);

-- Map skills to clusters
INSERT INTO public.skill_cluster_mapping (cluster_id, skill_id)
SELECT c.id, s.id
FROM public.skill_clusters c, public.skills s
WHERE 
  ((c.name = 'Frontend Specialist' AND s.category = 'Frontend') OR
   (c.name = 'Backend Engineer' AND s.category = 'Backend') OR
   (c.name = 'DevOps Engineer' AND s.category = 'DevOps') OR
   (c.name = 'Full-Stack Web Developer' AND s.category IN ('Frontend', 'Backend', 'DevOps', 'Programming')))
  AND NOT EXISTS (
    SELECT 1 FROM public.skill_cluster_mapping 
    WHERE skill_cluster_mapping.cluster_id = c.id 
    AND skill_cluster_mapping.skill_id = s.id
  );