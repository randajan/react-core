
import React, { Component, useContext, useState, useEffect } from 'react'
import { Helmet } from "react-helmet";

import jet from "@randajan/jetpack";
import PopUpProvider, { usePopUp } from "@randajan/react-popup";

import Provider, { Context } from "./Provider";
import Core from "./Core";
import Tray, { Task } from "./Tray";
import Query from "./Query";
import Crypt from "./Crypt";
import Storage from "./Storage";
import Session from "./Session";
import { LangLib } from "./Lang";


function useCore(...modules) {
  const Core = useContext(Context);
  const setState = useState()[1];

  useEffect(_ => {
      const onChange = _=>setState({});
      const mcl = modules.map(mod=>jet.obj.get(Core, [mod, "onChange"])).filter(_=>_);
      if (jet.isEmpty(mcl)) {mcl.push(Core.onChange);}
      mcl.map(cng=>cng.add(onChange));
      return _ => mcl.map(cng=>cng.delete(onChange));
  });

  return Core;
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
