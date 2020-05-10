
import React, { useState } from 'react'

function useForceRender(onChange) {
    const rerender = useState()[1];
    return useState(_=>_=>rerender({}))[0];
}

export default useForceRender;


