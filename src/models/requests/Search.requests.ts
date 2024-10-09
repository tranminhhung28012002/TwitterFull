import { MediaTypeQuery } from "../../constants/enums";
import { Pagination } from "./tweets.Requests";

export interface searchRequest extends Pagination {
  content: string
  media_type: MediaTypeQuery
}