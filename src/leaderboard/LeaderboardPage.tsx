import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../client/components/ui/card";
import { cn } from "../client/utils";
import { useState } from "react";
import { getUserNames, useQuery } from "wasp/client/operations";
export function LeaderboardPage() {
  return (
    <div className="py-10 lg:mt-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-foreground mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Leaderboard
          </h2>
        </div>
        <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-center text-lg leading-8">
          Under development leaderboard page!
        </p>
        <Card className="bg-muted/10 my-8">
          <CardContent className="mx-auto my-8 space-y-10 px-6 py-0 sm:w-[90%] md:w-[70%] lg:w-[50%]">
            <LeaderboardContent />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
function LeaderboardContent() {
  const [grade, setGrade] = useState(null as number | null);
  const { data: users = [], isLoading, error } = useQuery(getUserNames);
  let rank = 0
  return (
      <div className="flex flex-col gap-6 py-0" data-testid="schedule">
        <h2 className="text-4xl font-bold sm:text-4xl text-center mt-0">{grade === null ? "All Grades" : `${grade}th Grade`}</h2>
        <div className="flex justify-center gap-4"> 
          <button className="px-4 py-2  text-primary-foreground rounded-2xl 10 border-success/20 text-success border-2" onClick={() => {setGrade(null)}}>All</button>
          <button className="px-4 py-2  text-primary-foreground rounded-2xl 10 border-success/20 text-success border-2" onClick={() => {setGrade(9)}}>9th Grade</button>
          <button className="px-4 py-2  text-primary-foreground rounded-2xl 10 border-success/20 text-success border-2" onClick={() => {setGrade(10)}}>10th Grade</button>
          <button className="px-4 py-2  text-primary-foreground rounded-2xl 10 border-success/20 text-success border-2" onClick={() => {setGrade(11)}}>11th Grade</button>
          <button className="px-4 py-2  text-primary-foreground rounded-2xl 10 border-success/20 text-success border-2" onClick={() => {setGrade(12)}}>12th Grade</button>
        </div>
          {[...users].filter((user) => grade === null ? true : user.grade === grade).toSorted((a, b) => b.points - a.points).map((user) => (
            <LeaderboardEntry key={user.name} name={user.name} points={user.points} grade={user.grade} rank={++rank} />
          ))}
      </div>
  );
}
function LeaderboardEntry({ name, points, grade, rank }: { name: string | null; points: number; grade: number | null; rank: number }) {
  return (
    <Card className={cn("border-2", "10 border-success/20 text-success")}>
        <CardHeader className="pb-3" style={{padding: "20px"}}>
          
          <CardTitle className="flex flex-nowrap items-center justify-between text-base">
            <span className="inline-block items-center justify-between w-32">
            <span className="font-bold text-xl border-2 rounded-xl text-success p-1">#{rank}.</span>
            <span className="font-bold whitespace-nowrap ml-2">
              {name ?? "No name"}
            </span>
            </span>
            <span className="font-normal">
              {`${grade}th grade`}
            </span>
            <span className=" font-normal">
              {points} points
              
            </span>
                    
          </CardTitle>
        </CardHeader>
    </Card>
  );
}