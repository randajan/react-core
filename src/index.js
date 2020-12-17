import ModalProvider, {jet as jet_pu, Modal, PopUp, Pop, css } from "@randajan/react-popup";

import jet from "@randajan/jetpack";

import Analytics from "./Mods/Analytics";
import Auth from "./Mods/Auth";
import Core from "./Mods/Core";
import Icons from "./Mods/Icons";
import Images from "./Mods/Images";
import Lang from "./Mods/Lang";
import Page from "./Mods/Page";
import Screen from "./Mods/Screen";

import Base from "./Base/Base";
import Serf from "./Base/Serf";

import Api from "./Base/Api";
import Crypt from "./Base/Crypt";
import LangLib from "./Helpers/LangLib";

import Ico from "./Components/Ico";
import Img from "./Components/Img";
import Link from "./Components/Link";
import Pack from "./Components/Pack";
import Caption from "./Components/Caption";
import Nest from "./Components/Nest";
import Avatar from "./Components/Avatar";
import Tile from "./Components/Tile";
import Markdown from "./Components/Markdown";
import Article from "./Components/Article";
import Help from "./Components/Help";
import CoreProvider from "./Components/CoreProvider";

if (jet !== jet_pu) { throw new Error("Multiple jet instance present :("); }

export default CoreProvider;
export {
  jet,
  css,

  Base,
  Serf,

  Api,
  Analytics,
  Auth,
  Core,
  Icons,
  Images,
  Lang,
  Page,
  Screen,
  Help,

  Crypt,
  LangLib,


  Ico,
  Img,
  Link,
  Nest,
  Pack,
  Markdown,
  Caption,
  Avatar,
  Tile,
  Article,
  CoreProvider,

  ModalProvider,
  Modal,
  PopUp,
  Pop

}

