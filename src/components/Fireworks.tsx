import { keyframes } from "@stitches/react";
import { styled } from "../stitches/stitches.config";

const Bang = keyframes({
  to: {
    boxShadow:
      "165px -84.6666666667px #2fff00, 161px -239.6666666667px #fb00ff, -94px 39.3333333333px #00ff26, 152px -318.6666666667px #ff2600, -35px -211.6666666667px #00ffc4, 159px -337.6666666667px #00aaff, -240px -380.6666666667px #ff0009, 183px -5.6666666667px #b300ff, 96px -354.6666666667px #00ff59, 101px -69.6666666667px #00ffc4, -17px -246.6666666667px #a2ff00, 43px -309.6666666667px #5500ff, -147px -70.6666666667px #a200ff, -91px -291.6666666667px #1eff00, 186px -352.6666666667px #0080ff, -219px -55.6666666667px #0022ff, -85px -256.6666666667px #e1ff00, -85px -243.6666666667px #00ff1e, -29px 75.3333333333px #00ff48, 56px 78.3333333333px darkorange, 155px -259.6666666667px #bbff00, -3px -1.6666666667px #8c00ff, 107px -214.6666666667px #00ff6f, 107px -50.6666666667px #ff00c8, 87px -244.6666666667px #ff00bf, -140px 23.3333333333px #ff0048, -175px -166.6666666667px #b3ff00, 228px 30.3333333333px #9100ff, -163px -90.6666666667px #009dff, 63px -76.6666666667px #5500ff, 94px -150.6666666667px #ffc800, 244px -325.6666666667px #d5ff00, 178px -286.6666666667px #aeff00, 203px -403.6666666667px #c400ff, -178px 80.3333333333px #9d00ff, -30px -27.6666666667px #ff9100, 219px -134.6666666667px #ff004d, 170px -11.6666666667px #bb00ff, 185px -298.6666666667px #0095ff, -152px 10.3333333333px #33ff00, -208px -137.6666666667px #aeff00, 94px -404.6666666667px #ff003c, -172px -329.6666666667px #00ffbf, -58px -365.6666666667px #ffee00, -105px -288.6666666667px #ff8800, -126px 7.3333333333px #ff0051, 50px 20.3333333333px #ff0009, -4px -359.6666666667px #00ffb3, 177px -55.6666666667px #ff0033, 201px -66.6666666667px #ff0080, 83px -143.6666666667px #88ff00",
  },
});

const Gravity = keyframes({
  to: {
    transform: "translateY(200px)",
    MozTransform: "translateY(200px)",
    WebkitTransform: "translateY(200px)",
    OTransform: "translateY(200px)",
    MsTransform: "translateY(200px)",
    opacity: "0",
  },
});

const Position = keyframes({
  "0%, 19.9%": {
    marginTop: "10%",
    marginLeft: "40%",
  },
  "20%, 39.9%": {
    marginTop: "40%",
    marginLeft: "30%",
  },
  "40%, 59.9%": {
    marginTop: "20%",
    marginLeft: "70%",
  },
  "60%, 79.9%": {
    marginTop: "30%",
    marginLeft: "20%",
  },
  "80%, 99.9%": {
    marginTop: "30%",
    marginLeft: "80%",
  },
});

const Before = styled("div");

const After = styled("div");

const Pyro = styled("div", {
  [`& > ${Before}, & > ${After}`]: {
    position: "absolute",
    width: "5px",
    height: "5px",
    borderRadius: "50%",
    boxShadow:
      "0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff",
    MozAnimation: `1s ${Bang} ease-out infinite backwards, 1s ${Gravity} ease-in infinite backwards, 5s ${Position} linear infinite backwards`,
    WebkitAnimation: `1s ${Bang} ease-out infinite backwards, 1s ${Gravity} ease-in infinite backwards, 5s ${Position} linear infinite backwards`,
    OAnimation: `1s ${Bang} ease-out infinite backwards, 1s ${Gravity} ease-in infinite backwards, 5s ${Position} linear infinite backwards`,
    MsAnimation: `1s ${Bang} ease-out infinite backwards, 1s ${Gravity} ease-in infinite backwards, 5s ${Position} linear infinite backwards`,
    animation: `1s ${Bang} ease-out infinite backwards, 1s ${Gravity} ease-in infinite backwards, 5s ${Position} linear infinite backwards`,
  },
  [`& > ${After}`]: {
    MozAnimationDelay: "1.25s, 1.25s, 1.25s",
    WebkitAnimationDelay: "1.25s, 1.25s, 1.25s",
    OAnimationDelay: "1.25s, 1.25s, 1.25s",
    MsAnimationDelay: "1.25s, 1.25s, 1.25s",
    animationDelay: "1.25s, 1.25s, 1.25s",
    MozAnimationDuration: "1.25s, 1.25s, 6.25s",
    WebkitAnimationDuration: "1.25s, 1.25s, 6.25s",
    OAnimationDuration: "1.25s, 1.25s, 6.25s",
    MsAnimationDuration: "1.25s, 1.25s, 6.25s",
    animationDuration: "1.25s, 1.25s, 6.25s",
  },
});

export const Fireworks = () => {
  return (
    <Pyro>
      <Before />
      <After />
    </Pyro>
  );
};
