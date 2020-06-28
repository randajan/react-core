import ModalProvider, {jet as jet_pu, Modal, PopUp, Pop, css } from "@randajan/react-popup";

import jet from "@randajan/jetpack";

import Api from "./Mods/Api";
import Auth from "./Mods/Auth";
import Core from "./Mods/Core";
import Icons from "./Mods/Icons";
import Images from "./Mods/Images";
import Lang from "./Mods/Lang";
import Query from "./Mods/Query";
import User from "./Mods/User";
import View from "./Mods/View";

import Base from "./Helpers/Base";
import Crypt from "./Helpers/Crypt";
import LangLib from "./Helpers/LangLib";
import Task from "./Helpers/Task";

import Ico from "./Components/Ico";
import Img from "./Components/Img";
import Provider from "./Components/Provider";

if (jet !== jet_pu) { throw new Error("Multiple jet instance present :("); }

export default Provider;
export {
  jet,
  css,
  Base,
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
  Task,

  Ico,
  Img,
  Provider,

  ModalProvider,
  Modal,
  PopUp,
  Pop

}

