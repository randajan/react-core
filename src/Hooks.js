
import React, { useContext, useState, useEffect } from 'react'

import { usePopUp, PopUp } from "@randajan/react-popup";

const Context = React.createContext();

function usePromise(prom, deps) {
  const [error, setError] = useState();
  const [data, setData] = useState();

  useEffect(_=>{jet.get("promise", jet.is("function") ? prom() : prom).then(setData, setError);}, deps);
  return [data, error];
}

function useCore(...modules) {
  const Core = useContext(Context);
  const setState = useState()[1];
  useEffect(_ => Core.addOnChange(_=>setState({}), modules), []);
  return Core;
}

function useCrypt() {return useCore().Crypt;}
function useQuery() {return useCore("Query").Query;}
function useView() {return useCore("View").View;}
function useStorage() {return useCore("Storage").Storage;}
function useVault() {return useCore("Vault").Vault;}
function useSession() {return useCore("Session").Session;}
function useLang() {return useCore("Lang").Lang;}
function useApi() {return useCore().Api;}
function useAuth() {return useCore("Auth").Auth;}
function useUser() {return useAuth().User;}
function useIcons() {return useCore("Icons").Icons;}
function useImages() {return useCore("Images").Images;}

function Ico(props) {
  return useIcons().get(props);
}

function Img(props) {
  return useImages().get(props);
}

export default Context
export {
  usePromise,
  useCore,
  usePopUp,
  useCrypt,
  useView,
  useStorage,
  useVault,
  useSession,
  useLang,
  useApi,
  useQuery,
  useAuth,
  useUser,
  useIcons,
  useImages,
  PopUp,
  Ico,
  Img
}
