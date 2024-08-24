enum SuggestionStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
}
export interface IRole {
  id: number;
  title: string;
  description: string;
  users?: IUser[]; // Relation to User model
  userIds?: number[];
  createdAt: Date;
  updatedAt: Date;
}
export interface IUser {
  id: number;
  name: string;
  email: string;
  username: string;
  password: string;
  role: IRole; // Relation to Role model
  roleId: number;
  createdAt: Date;
  updatedAt: Date;
  objects?: IObject[]; // Relation to Object model
  objectIds?: number[];
  posts?: IPost[]; // Relation to Post model
  postIds?: number[];
}
export interface ICategory {
  id: number;
  title: string;
  objects?: IObject[]; // Relation to Object model
  objectIds?: number[];
}
export interface IObject {
  id: number;
  name: string;
  category: ICategory; // Relation to Category model
  categoryId: number;
  description: string;
  owner: IUser; // Relation to User model
  ownerId: number;
  photos: string[];
  posts?: IPost[]; // Corrected to reflect direct relation to Post via ObjectPost
  postIds?: number[];
  suggestions?: IObjectSuggestion[]; // Relation to ObjectSuggestion model
  suggestionIds?: number[];
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
export interface IPost {
  id: number;
  author: IUser; // Direct relation to User
  authorId: number;
  description: string;
  objects?: IObject[]; // Corrected to reflect direct relation to Object via ObjectPost
  objectIds: number[];
  suggestions?: ISuggestion[]; // Direct relation to Suggestion
  suggestionIds: number[];
  latitude?: number;
  longitude?: number;
  address?: string;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
export interface IObjectPost {
  id: number;
  object: IObject; // Relation to Object model
  objectId: number;
  post: IPost; // Relation to Post model
  postId: number;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
export interface ISuggestion {
  id: number;
  status: SuggestionStatus; // Enum SuggestionStatus
  post: IPost; // Direct relation to Post
  postId: number;
  objectIds: number[];
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
export interface IObjectSuggestion {
  id: number;
  object: IObject; // Relation to Object model
  objectId: number;
  suggestion: ISuggestion; // Relation to Suggestion model
  suggestionId: number;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
