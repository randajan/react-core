import { useContext, useState, useEffect } from 'react'
import Core from "./Core";
import { usePopUp } from "@randajan/react-popup";
import Tray, { Task } from "./Tray";
import Query from "./Query";
import Crypt from "./Crypt";
import Storage from "./Storage";
import Session from "./Session";
import { LangLib } from "./Lang";


function useCore(...modules) {
  const C = useContext(Core.Context);
  const setState = useState()[1];

  useEffect(_ => {
      const onChange = _=>setState({});
      const mcl = modules.map(mod=>jet.obj.get(C, [mod, "onChange"])).filter(_=>_);
      if (jet.isEmpty(mcl)) {mcl.push(C.onChange);}
      mcl.map(cng=>cng.add(onChange));
      return _ => mcl.map(cng=>cng.delete(onChange));
  });

  return C;
}

function useCrypt() {return useCore().Crypt;}
function useQuery() {return useCore("Query").Query;}
function useView() {return useCore("View").View;}
function useStorage() {return useCore().Storage;}
function useSession() {return useCore().Session;}
function useLang() {return useCore("Lang").Lang;}
function useApi() {return useCore().Api;}
function useAuth() {return useCore("Auth").Auth;}
function useUser() {return useAuth().User;}


export default Core;
export {
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
