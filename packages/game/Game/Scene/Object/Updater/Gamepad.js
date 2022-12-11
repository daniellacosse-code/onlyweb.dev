export default (action) => {
  // TODO: create a "controller stack" that assigns controller IDs to positions in a stack
  // based on how they're connected/disconnected.

  return (parameters) => {
    const [gamepad] = navigator.getGamepads();

    if (!gamepad) return;

    const {
      buttons: [
        bottomSemantic,
        rightSemantic,
        topSemantic,
        leftSemantic,
        leftBumper,
        rightBumper,
        leftTrigger,
        rightTrigger,
        select,
        start,
        leftStick,
        rightStick,
        topDirectional,
        bottomDirectional,
        leftDirectional,
        rightDirectional,
        system
      ],
      axes: [
        horizontalLeftStick,
        verticalLeftStick,
        horizontalRightStick,
        verticalRightStick
      ]
    } = gamepad;

    action({
      ...parameters,
      gamepad: {
        analog: {
          left: {
            button: leftStick,
            horizontal: horizontalLeftStick,
            vertical: verticalLeftStick
          },
          right: {
            button: rightStick,
            horizontal: horizontalRightStick,
            vertical: verticalRightStick
          }
        },
        directionalPad: {
          down: bottomDirectional,
          left: leftDirectional,
          right: rightDirectional,
          up: topDirectional
        },

        // on dualshock - confirm: X, cancel: O, utility1: 🔳, utility2: △
        // on xbox - confirm: A, cancel: B, utility1: X, utility2: Y
        semantic: {
          cancel: rightSemantic,
          confirm: bottomSemantic,
          select,
          start,
          system,
          utility1: leftSemantic,
          utility2: topSemantic
        },
        shoulders: {
          left: {
            bumper: leftBumper,
            trigger: leftTrigger
          },
          right: {
            bumper: rightBumper,
            trigger: rightTrigger
          }
        }
      }
    });
  };
};
