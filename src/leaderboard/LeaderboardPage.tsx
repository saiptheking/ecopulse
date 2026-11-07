import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../client/components/ui/card";
import { WobbleCard } from "../components/velora/wobble-card";
import { cn } from "../client/lib/utils";
import { RippleButton } from "../components/velora/ripple-button";
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
        </p>
            <LeaderboardContent />
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
          <RippleButton className="px-4 py-2  text-primary-foreground rounded-2xl 10 border-success/20 text-success border-2 bg-card" onClick={() => {setGrade(9)}}>9th Grade</RippleButton>
          <RippleButton className="px-4 py-2  text-primary-foreground rounded-2xl 10 border-success/20 text-success border-2 bg-card" onClick={() => {setGrade(10)}}>10th Grade</RippleButton>
          <RippleButton className="px-4 py-2  text-primary-foreground rounded-2xl 10 border-success/20 text-success border-2 bg-card" onClick={() => {setGrade(11)}}>11th Grade</RippleButton>
          <RippleButton className="px-4 py-2  text-primary-foreground rounded-2xl 10 border-success/20 text-success border-2 bg-card" onClick={() => {setGrade(12)}}>12th Grade</RippleButton>
        </div>
          {[...users].filter((user) => grade === null ? true : user.grade === grade).toSorted((a, b) => b.points - a.points).map((user) => (
            <LeaderboardEntry key={user.name} name={user.name} points={user.points} grade={user.grade} rank={++rank} />
          ))}
      </div>
  );
}
function LeaderboardEntry({ name, points, grade, rank }: { name: string | null; points: number; grade: number | null; rank: number }) {
  return (
    <WobbleCard className={cn("border-2", "10 border-success/20 text-success rounded-2xl bg-card")} contentClassName="p-1 sm:p-4">
        <CardHeader className="pb-3" style={{padding: "20px"}}>
          
          <CardTitle className="flex flex-nowrap items-center justify-between text-base">
            <span className="inline-block items-center justify-between w-32">
            <span className="font-bold text-xl border-2 rounded-xl text-success p-1">#{rank}.</span>
            <span className="font-bold whitespace-nowrap ml-2">
              {name ?? "No name"}
            </span>
            </span>
            <span className=" font-normal">
              {points} points
              
            </span>
                    
          </CardTitle>
        </CardHeader>
    </WobbleCard>
  );
}