import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, Trash2 } from "lucide-react";

interface StoryCardProps {
  id: string;
  title: string;
  excerpt: string;
  subject: string;
  type: string;
  date: string;
  status: "draft" | "published";
  imageUrl?: string;
  onClick?: () => void;
  onDelete?: (id: string) => void;
}

export default function StoryCard({
  id,
  title,
  excerpt,
  subject,
  type,
  date,
  status,
  imageUrl,
  onClick,
  onDelete,
}: StoryCardProps) {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete(id);
  };

  return (
    <Card
      className="overflow-hidden hover-elevate cursor-pointer relative group"
      onClick={onClick}
      data-testid={`story-card-${id}`}
    >
      {imageUrl && (
        <div className="aspect-video bg-muted">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
      {!imageUrl && (
        <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-xl">
              {subject.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <div className="text-muted-foreground text-sm">{subject}</div>
          </div>
        </div>
      )}
      <CardHeader>
        <div className="flex items-start gap-2 mb-2">
          <div className="flex items-center gap-2 flex-1 flex-wrap">
            <Badge variant="secondary" className="text-xs">{type}</Badge>
            <Badge
              variant="secondary"
              className={status === "published" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : ""}
            >
              {status}
            </Badge>
          </div>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleDeleteClick}
              data-testid={`button-delete-story-${id}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">{excerpt}</p>
      </CardContent>
      <CardFooter className="flex items-center gap-4 text-xs text-muted-foreground border-t pt-4">
        <div className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5" />
          <span>{subject}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          <span>{date}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
