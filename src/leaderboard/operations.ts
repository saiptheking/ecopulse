import { type User } from "wasp/entities";
import type { GetUserNames } from "wasp/server/operations";

type UserName = Pick<User, "id" | "name" | "grade" | "points">;

export const getUserNames: GetUserNames<void, UserName[]> = async (
  _args: any,
  context: any,
) => {
    return context.entities.User.findMany({
      select: {
        id: true,
        name: true,
        grade: true,
        points: true,
      },
      orderBy: {
        points: "desc",
      },
    });
}