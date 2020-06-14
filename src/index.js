import ModalProvider, {jet as jetModal,  Modal, PopUp, ClassNames, Pop, usePromise, useForceRender } from "@randajan/react-popup";

import jet from "@randajan/jetpack";

import Api from "./Mods/Api";
import Auth from "./Mods/Auth";
import Core from "./Mods/Core";
import Case from "./Mods/Case";
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

//alert(jet === jetModal);

export default Provider;
export {
  jet,
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
  Case,
  Session,
  Space,
  Storage,
  Task,
  Tray,

  Ico,
  Img,
  Provider,

  ModalProvider,
  Modal,
  PopUp,
  ClassNames,
  Pop,

  usePromise,
  useForceRender
}

