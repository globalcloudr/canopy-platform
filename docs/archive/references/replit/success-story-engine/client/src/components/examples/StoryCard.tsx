import StoryCard from "../StoryCard";

export default function StoryCardExample() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-6xl">
      <StoryCard
        id="1"
        title="Dreams on the Path to Citizenship"
        excerpt="Yesenia Quintanilla arrived in the United States for the first time from her native El Salvador in 1989 to live with her mother in Los Angeles. A decade later, she enrolled at Fresno Adult School to earn her high school diploma."
        subject="Yesenia Quintanilla"
        type="ESL"
        date="Mar 15, 2024"
        status="published"
      />
      <StoryCard
        id="2"
        title="The Future Is Hers"
        excerpt="Following the tragic death of her son's father, Angela Byrd didn't know where to turn when she found herself on government assistance as a single mother. She wanted to improve the lives of her and her son but was unsure how to do so."
        subject="Angela Byrd"
        type="HSD/GED"
        date="Mar 18, 2024"
        status="published"
      />
      <StoryCard
        id="3"
        title="Third Time's the Charm"
        excerpt="A determined student finally achieves their dream of becoming a medical assistant after completing the CTE program at Lompoc Adult School and Career Center."
        subject="Medical Assistant Student"
        type="CTE"
        date="Apr 2, 2024"
        status="draft"
      />
    </div>
  );
}
