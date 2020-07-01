import ModalProvider, {jet as jet_pu, Modal, PopUp, Pop, css } from "@randajan/react-popup";

import jet from "@randajan/jetpack";

import Api from "./Mods/Api";
import Auth from "./Mods/Auth";
import Core from "./Mods/Core";
import Icons from "./Mods/Icons";
import Images from "./Mods/Images";
import Lang from "./Mods/Lang";
import Page from "./Mods/Page";
import User from "./Mods/User";
import View from "./Mods/View";

import Base from "./Base/Base";
import Task from "./Base/Task";
import Serf from "./Base/Serf";

import Crypt from "./Base/Crypt";
import LangLib from "./Helpers/LangLib";


import Ico from "./Components/Ico";
import Img from "./Components/Img";
import CoreProvider from "./Components/CoreProvider";

if (jet !== jet_pu) { throw new Error("Multiple jet instance present :("); }

export default Core;
export {
  jet,
  css,

  Base,
  Serf,
  Task,

  Api,
  Auth,
  Core,
  Icons,
  Images,
  Lang,
  Page,
  User,
  View,

  Crypt,
  LangLib,

  Ico,
  Img,
  CoreProvider,

  ModalProvider,
  Modal,
  PopUp,
  Pop

}

