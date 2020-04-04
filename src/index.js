import Core from "./Core";
import Tray, { Task } from "./Tray";
import Query from "./Query";
import Crypt from "./Crypt";
import Storage from "./Storage";
import Session from "./Session";
import { LangLib } from "./Lang";

import Provider from "./Provider";
import Context, {
  useCore,
  usePopUp,
  useCrypt,
  useView,
  useStorage,
  useSession,
  useLang,
  useApi,
  useQuery,
  useAuth,
  useUser
} from "./Hooks";



export default Provider;
export {
  Context,
  Core,
  Tray,
  Task,
  Query,
  Crypt,
  Storage,
  Session,
  LangLib,
  useCore,
  usePopUp,
  useCrypt,
  useView,
  useStorage,
  useSession,
  useLang,
  useApi,
  useQuery,
  useAuth,
  useUser
}
