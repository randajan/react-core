import { useContext, useState, useEffect } from 'react'
import Core from "./Core";
import { usePopUp } from "@randajan/react-popup";
import Tray, { Task } from "./Tray";
import Query from "./Query";
import Crypt from "./Crypt";
import Storage from "./Storage";
import Session from "./Session";
import { LangLib } from "./Lang";


function useCore() {
  const provider = useContext(Core.Context);
  const setState = useState()[1];

  useEffect(_ => {
      const onChange = _=>setState({});
      provider.onChange.add(onChange);
      return _ => provider.onChange.delete(onChange);
  });

  return provider;
}

function useCrypt() {return useCore().Crypt;}
function useView() {return useCore().View;}
function useStorage() {return useCore().Storage;}
function useSession() {return useCore().Session;}
function useLang() {return useCore().Lang;}
function useApi() {return useCore().Api;}
function useAuth() {return useCore().Auth;}
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
  useAuth,
  useUser
}
