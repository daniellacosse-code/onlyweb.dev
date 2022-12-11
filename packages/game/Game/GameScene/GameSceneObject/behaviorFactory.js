// TODO: there's definitely a need for a "behavior" or even just "object" lifecycle:
// - requesting permissions on start
// - removing event listeners on "unmount"

export const gamepadBehaviorFactory = () => {
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

    behavior({
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

export const keyboardBehaviorFactory = (behavior) => {
  const keyboard = {};

  addEventListener("keydown", ({ key }) => (keyboard[key] = true));
  addEventListener("keyup", ({ key }) => (keyboard[key] = false));

  return (parameters) => behavior({ ...parameters, keyboard });
};

export const deviceOrientationBehaviorFactory = async () => {
  if (!DeviceOrientationEvent) return () => {};

  // NOTE: must be done in response to a button press...
  if (DeviceOrientationEvent.requestPermission) {
    try {
      await DeviceOrientationEvent.requestPermission();
    } catch (e) {
      return () => {};
    }
  }

  const orientation = { rotation: {} };

  addEventListener("deviceorientation", ({ alpha, gamma, beta }) => {
    orientation.rotation.x = Math.floor(alpha ?? 0);
    orientation.rotation.y = Math.floor(gamma ?? 0);
    orientation.rotation.z = Math.floor(beta ?? 0);
  });

  return (parameters) => behavior({ ...parameters, orientation });
};
