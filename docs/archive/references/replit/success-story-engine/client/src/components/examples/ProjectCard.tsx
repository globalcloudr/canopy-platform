import ProjectCard from "../ProjectCard";

export default function ProjectCardExample() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-6xl">
      <ProjectCard
        id="1"
        title="Ventura County Adult Ed Consortium"
        description="Collection of 12 stories highlighting ESL, HSD/GED, and CTE programs across the consortium"
        storyCount={12}
        status="published"
        date="Mar 15, 2024"
        onClick={() => console.log("Project clicked")}
      />
      <ProjectCard
        id="2"
        title="Oakland Adult School Success Stories"
        description="Student and employer stories showcasing career training outcomes"
        storyCount={8}
        status="in-progress"
        date="Apr 2, 2024"
        onClick={() => console.log("Project clicked")}
      />
      <ProjectCard
        id="3"
        title="Lompoc Adult School Spotlight"
        description="Teacher recruitment and partnership stories for community outreach"
        storyCount={5}
        status="review"
        date="Apr 10, 2024"
        onClick={() => console.log("Project clicked")}
      />
    </div>
  );
}
