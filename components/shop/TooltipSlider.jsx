import * as React from "react";
import "rc-tooltip/assets/bootstrap.css";
import Slider from "rc-slider";
import raf from "rc-util/lib/raf";
import Tooltip from "rc-tooltip";
const HandleTooltip = (props) => {
  const {
    value,
    children,
    visible,
    tipFormatter = (val) => `${val} %`,
  } = props;
  let restProps = { ...props };
  const tooltipRef = React.useRef();
  const rafRef = React.useRef(null);
  function cancelKeepAlign() {
    raf.cancel(rafRef.current);
  }
  function keepAlign() {
    rafRef.current = raf(() => {
      var _a;
      (_a = tooltipRef.current) === null || _a === void 0
        ? void 0
        : _a.forcePopupAlign();
    });
  }
  React.useEffect(() => {
    if (visible) {
      keepAlign();
    } else {
      cancelKeepAlign();
    }
    return cancelKeepAlign;
  }, [value, visible]);
  return (
    <Tooltip
      placement="top"
      overlay={tipFormatter(value)}
      overlayInnerStyle={{ minHeight: "auto" }}
      ref={tooltipRef}
      visible={visible}
      {...restProps}
    >
      {children}
    </Tooltip>
  );
};
export const handleRender = (node, props) => {
  return (
    <HandleTooltip value={props.value} visible={props.dragging}>
      {node}
    </HandleTooltip>
  );
};
const TooltipSlider = (_a) => {
  var { tipFormatter, tipProps } = _a,
    props = { ..._a, tipFormatter, tipProps };
  const tipHandleRender = (node, handleProps) => {
    return (
      <HandleTooltip
        value={handleProps.value}
        visible={handleProps.dragging}
        tipFormatter={tipFormatter}
        {...tipProps}
      >
        {node}
      </HandleTooltip>
    );
  };
  return <Slider {...props} handleRender={tipHandleRender} />;
};
export default TooltipSlider;
