import { type Task } from "wasp/entities";
import { Card3D, Card3DItem } from "../components/velora/3d-card";
import { MagneticButton } from "../components/velora/magnetic-button";
import { HyperText } from "../components/velora/hyper-text";
import { RainbowButton } from "../components/velora/rainbow-button";
import {
  createTask,
  deleteTask,
  updateTask,
} from "wasp/client/operations";
import { Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../client/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../client/components/ui/card";
import { Checkbox } from "../client/components/ui/checkbox";
import { Input } from "../client/components/ui/input";
import { cn } from "../client/lib/utils";
import type {
  GeneratedSchedule,
  Task as ScheduleTask,
  TaskItem,
  TaskPriority,
} from "./schedule";

export function FeedPage() {
  return (
    <div className="py-10 lg:mt-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-foreground mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Challenges
          </h2>
        </div>
        {/* begin AI-powered Todo List */}
        <Card className="bg-muted/10 my-8">
          <CardContent className="mx-auto my-8 space-y-10 px-6 py-10 sm:w-[90%] md:w-[70%] lg:w-[50%]">
            <NewTaskForm handleCreateTask={createTask} />
          </CardContent>
        </Card>
        {/* end AI-powered Todo List */}
      </div>
    </div>
  );
}

export function NewTaskForm({
  handleCreateTask,
}: {
  handleCreateTask: typeof createTask;
}) {
  const [description, setDescription] = useState<string>("");
  const [todaysHours, setTodaysHours] = useState<number>(8);
  const [response, setResponse] = useState<GeneratedSchedule | null>({
    tasks: [
      { name: "Electricity", priority: "medium" },
      { name: "Recycling", priority: "high" },
      { name: "Water", priority: "low" },
    ],
    taskItems: [
      { description: "Turn off unused devices", time: 0.5, taskName: "Electricity" },
      { description: "Pick up trash", time: 1, taskName: "Recycling" },
      { description: "Fix leaky devices", time: 0.5, taskName: "Water" },
    ],
  });
  return (
      
        <div className="flex flex-col">
          <HyperText className="text-foreground mb-4 text-lg font-semibold">
            Challenge Feed
          </HyperText>
          <Schedule schedule={response} />
        </div>
  );
}

type TodoProps = Pick<Task, "id" | "isDone" | "description" | "time">;

function Todo({ id, isDone, description, time }: TodoProps) {
  const handleCheckboxChange = async (checked: boolean) => {
    await updateTask({
      id,
      isDone: checked,
    });
  };

  const handleTimeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await updateTask({
      id,
      time: e.currentTarget.value,
    });
  };

  const handleDeleteClick = async () => {
    await deleteTask({ id });
  };

  return (
    <Card className="p-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex w-full items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={isDone}
              onCheckedChange={handleCheckboxChange}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <span
              className={cn("text-foreground", {
                "text-muted-foreground line-through": isDone,
              })}
            >
              {description}
            </span>
          </div>
          <div className="flex items-center gap-2">
              hrs
          </div>
        </div>
        <div className="w-15 flex items-center justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteClick}
            title="Remove task"
            className="text-destructive hover:text-destructive/80 h-auto p-1"
          >
            <Trash2 size="20" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

function Schedule({ schedule }: { schedule: GeneratedSchedule | null }) {
  return (
    <div className="flex flex-col gap-6 py-6" data-testid="schedule">
      <div className="space-y-4">
        {schedule?.tasks ? (
          schedule.tasks
            .map((task) => (
              <TaskCard
                key={task.name}
                task={task}
                taskItems={schedule.taskItems}
              />
            ))
            .sort((a, b) => {
              const priorityOrder: TaskPriority[] = ["low", "medium", "high"];
              if (a.props.task.priority && b.props.task.priority) {
                return (
                  priorityOrder.indexOf(b.props.task.priority) -
                  priorityOrder.indexOf(a.props.task.priority)
                );
              } else {
                return 0;
              }
            })
        ) : (
          <div className="text-muted-foreground text-center">
            OpenAI didn't return any Tasks. Try again.
          </div>
        )}
      </div>
    </div>
  );
}

function TaskCard({
  task,
  taskItems,
}: {
  task: ScheduleTask;
  taskItems?: TaskItem[];
}) {
  const taskPriorityToColorMap: Record<TaskPriority, string> = {
    high: "bg-destructive/10 border-destructive/20 text-red-500",
    medium: "bg-warning/10 border-warning/20 text-warning",
    low: "bg-success/10 border-success/20 text-success",
  };

  const priorityColor =
    task.priority === undefined
      ? "bg-muted/10 border-border"
      : taskPriorityToColorMap[task.priority];

  return (
    <Card3D cardClassName={cn("border-2", priorityColor, "rounded-2xl bg-card p-6 shadow-md")}>
        <Card3DItem depth={50} className="flex items-center justify-between text-base pb-3">
          <span>{task.name}(5kg CO2 Saved)</span>
        </Card3DItem>
        <Card3DItem depth={90}>
        {task.description && (
          <p className="text-muted-foreground mb-3 text-sm">{task.description}</p>
        )}
        </Card3DItem>
        <div className="text-muted-foreground text-center">
          <Card3DItem depth={70}>
          <p>Want to participate? Upload your photo!</p>
          </Card3DItem>
          <Card3DItem depth={80}>
          <a href="/file-upload">
          <RainbowButton className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-md"   style={{
    "--brand-from": "#19a74d",
    "--brand-via": "#146733",
    "--brand-to": "#114323",
  } as React.CSSProperties}>
            Upload Photo
          </RainbowButton>
          </a>
          </Card3DItem>
        </div>
    </Card3D>
  );
}

function TaskCardItem({ description, time }: TaskItem) {
  const [isDone, setIsDone] = useState<boolean>(false);

  const formattedTime = useMemo(() => {
    if (time === 0) return "0min";
    const hours = Math.floor(time);
    const minutes = Math.round((time - hours) * 60);

    const parts: string[] = [];
    if (hours > 0) parts.push(`${hours}hr`);
    if (minutes > 0) parts.push(`${minutes}min`);

    return parts.join(" ");
  }, [time]);

  const handleCheckedChange = (checked: boolean | "indeterminate") => {
    setIsDone(checked === true);
  };

  return (
    <li className="flex items-center justify-between gap-4 rounded-md p-2">
      <div className="flex flex-1 items-center gap-3">
        <Checkbox
          checked={isDone}
          onCheckedChange={handleCheckedChange}
          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
        <span
          className={cn("text-sm leading-tight", {
            "text-muted-foreground line-through opacity-50": isDone,
          })}
        >
          {description}
        </span>
      </div>
      <span
        className={cn("text-muted-foreground text-sm", {
          "line-through opacity-50": isDone,
        })}
      >
        {formattedTime}
      </span>
    </li>
  );
}
