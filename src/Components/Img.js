import React from 'react'

import Images from "../Mods/Images";

function Img(props) {
  return Images.use().get(props);
}

export default Img;
