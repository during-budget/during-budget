import { IUser } from "src/models/User";
import { Challenge as ChallengeModel, IChallenge } from "src/models/Challenge";
import { Transaction as TransactionModel } from "src/models/Transaction";
import { HydratedDocument, Types } from "mongoose";
import { CategoryService } from "./users";
import { CategoryNotFoundError } from "errors/NotFoundError";

type createDateType = {
  startDate: Date;
  endDate: Date;
  amount: number;
  comparison: "lt" | "lte" | "gt" | "gte";
};

const create = async (
  userRecord: IUser,
  data: createDateType,
  opts: {
    type: "category" | "tag";
    categoryId?: Types.ObjectId | string;
    tag?: string;
  }
) => {
  const challengeRecord = await ChallengeModel.create({
    userId: userRecord._id,
    startDate: data.startDate,
    endDate: data.endDate,
    amount: data.amount,
    comparison: data.comparison,
    ...opts,
  });

  return { challenge: challengeRecord };
};

export const createCategoryChallenge = async (
  userRecord: IUser,
  categoryId: Types.ObjectId | string,
  data: createDateType
) => {
  const { category } = CategoryService.findById(userRecord, categoryId);
  if (!category) {
    throw new CategoryNotFoundError();
  }

  const { challenge: challengeRecord } = await create(userRecord, data, {
    type: "category",
    categoryId,
  });

  return { challenge: challengeRecord };
};

export const createTagChallenge = async (
  userRecord: IUser,
  tag: string,
  data: createDateType
) => {
  const { challenge: challengeRecord } = await create(userRecord, data, {
    type: "tag",
    tag,
  });

  return { challenge: challengeRecord };
};

export const findByUserId = async (userId: Types.ObjectId | string) => {
  const challengeRecordList = await ChallengeModel.find({ userId });
  return { challenges: challengeRecordList };
};

export const findById = async (challengeId: Types.ObjectId | string) => {
  const challengeRecord = await ChallengeModel.findById(challengeId);
  return { challenge: challengeRecord };
};

export const isUser = (challengeRecord: IChallenge, userRecord: IUser) =>
  challengeRecord.userId.equals(userRecord._id);

export const findChallengeTransactions = async (
  userRecord: IUser,
  challengeRecord: IChallenge
) => {
  if (challengeRecord.type === "category") {
    const transactionRecordList = await TransactionModel.find({
      userId: userRecord._id,
      budgetId: { $ne: userRecord.basicBudgetId },
      date: { $gte: challengeRecord.startDate, $lte: challengeRecord.endDate },
      "category.categoryId": challengeRecord.categoryId,
    });
    return { transactions: transactionRecordList };
  }
  if (challengeRecord.type === "tag") {
    const transactionRecordList = await TransactionModel.find({
      userId: userRecord._id,
      budgetId: { $ne: userRecord.basicBudgetId },
      date: { $gte: challengeRecord.startDate, $lte: challengeRecord.endDate },
      tags: { $elemMatch: { $eq: challengeRecord.tag } },
    });
    return { transactions: transactionRecordList };
  }
  return { transactions: [] };
};

export const remove = async (challengeRecord: HydratedDocument<IChallenge>) => {
  await challengeRecord.remove();
};
