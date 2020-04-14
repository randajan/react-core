
import React, { useContext, useState, useEffect } from 'react'

import { usePopUp } from "@randajan/react-popup";

const Context = React.createContext();

function useCore(...modules) {
  const Core = useContext(Context);
  const setState = useState()[1];
  useEffect(_ => Core.regOnChange(_=>setState({}), modules));
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
  useUser,
  useIcons,
  useImages,
  Ico,
  Img
}
