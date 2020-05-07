import { usePopUp, PopUp } from "@randajan/react-popup";

import Api from "./Mods/Api";
import Auth from "./Mods/Auth";
import Core from "./Mods/Core";
import Icons from "./Mods/Icons";
import Images from "./Mods/Images";
import Lang from "./Mods/Lang";
import Query from "./Mods/Query";
import User from "./Mods/User";
import View from "./Mods/View";

import Crypt from "./Helpers/Crypt";
import LangLib from "./Helpers/LangLib";
import Session from "./Helpers/Session";
import Space from "./Helpers/Space";
import Storage from "./Helpers/Storage";
import Task from "./Helpers/Task";
import Tray from "./Helpers/Tray";

import Ico from "./Components/Ico";
import Img from "./Components/Img";
import Provider from "./Components/Provider";

import usePromise from "./Hooks/usePromise";

export default Provider;
export {
  Api,
  Auth,
  Core,
  Icons,
  Images,
  Lang,
  Query,
  User,
  View,

  Crypt,
  LangLib,
  Session,
  Space,
  Storage,
  Task,
  Tray,

  Ico,
  Img,
  Provider,
  PopUp,
  
  usePromise,
  usePopUp,
}

