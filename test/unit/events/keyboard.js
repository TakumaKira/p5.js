suite.only('Keyboard Events', function() {
  var myp5;

  setup(function(done) {
    new p5(function(p) {
      p.setup = function() {
        myp5 = p;
        done();
      };
    });
  });

  teardown(function() {
    myp5.remove();
  });

  suite('p5.prototype.keyIsPressed', function() {
    test('keyIsPressed should be a boolean', function() {
      assert.isBoolean(myp5.keyIsPressed);
    });

    test('keyIsPressed should be true on key press', function() {
      window.dispatchEvent(new KeyboardEvent('keydown'));
      assert.strictEqual(myp5.keyIsPressed, true);
    });

    test('keyIsPressed should be false on key up', function() {
      window.dispatchEvent(new KeyboardEvent('keyup'));
      assert.strictEqual(myp5.keyIsPressed, false);
    });
  });

  suite('p5.prototype.isKeyPressed', function() {
    test('isKeyPressed should be a boolean', function() {
      assert.isBoolean(myp5.isKeyPressed);
    });

    test('isKeyPressed should be true on key press', function() {
      window.dispatchEvent(new KeyboardEvent('keydown'));
      assert.strictEqual(myp5.isKeyPressed, true);
    });

    test('isKeyPressed should be false on key up', function() {
      window.dispatchEvent(new KeyboardEvent('keyup'));
      assert.strictEqual(myp5.isKeyPressed, false);
    });
  });

  suite('p5.prototype.key', function() {
    test('key should be a string', function() {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 's' }));
      assert.isString(myp5.key);
    });

    test('key should return the key pressed', function() {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'A' }));
      assert.strictEqual(myp5.key, 'A');
    });

    test('key should return the key pressed', function() {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: '9' }));
      assert.strictEqual(myp5.key, '9');
    });

    test('key should return the key pressed', function() {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'CapsLock' }));
      assert.strictEqual(myp5.key, 'CapsLock');
    });
  });

  suite('p5.prototype.keyCode', function() {
    test('keyCode should be a number', function() {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 's' }));
      assert.isNumber(myp5.keyCode);
    });

    test('key should return the key pressed', function() {
      window.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 65 }));
      assert.strictEqual(myp5.keyCode, 65);
    });

    test('key should return the key pressed', function() {
      window.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 20 }));
      assert.strictEqual(myp5.keyCode, 20);
    });
  });

  suite('keyPressed', function() {
    test('keyPressed functions on multiple instances must run once', async function() {
      let sketchFn = function(sketch, resolve, reject) {
        let count = 0;
        sketch.keyPressed = function() {
          count += 1;
        };

        sketch.finish = function() {
          resolve(count);
        };
      };
      let sketches = parallelSketches([sketchFn, sketchFn]); //create two sketches
      await sketches.setup; //wait for all sketches to setup
      window.dispatchEvent(new KeyboardEvent('keydown')); //dispatch a keyboard event to trigger the keyPressed functions
      sketches.end(); //resolve all sketches by calling their finish functions
      let counts = await sketches.result; //get array holding number of times keyPressed was called. Rejected sketches also thrown here
      assert.deepEqual(counts, [1, 1]); //check if every keyPressed function was called once
    });
  });

  suite('keyReleased', function() {
    test('keyReleased functions on multiple instances must run once', async function() {
      let sketchFn = function(sketch, resolve, reject) {
        let count = 0;

        sketch.keyReleased = function() {
          count += 1;
        };

        sketch.finish = function() {
          resolve(count);
        };
      };
      let sketches = parallelSketches([sketchFn, sketchFn]); //create two sketches
      await sketches.setup; //wait for all sketches to setup
      window.dispatchEvent(new KeyboardEvent('keyup')); //dispatch a keyboard event to trigger the keyReleased functions
      sketches.end(); //resolve all sketches by calling their finish functions
      let counts = await sketches.result; //get array holding number of times keyPressed was called. Rejected sketches also thrown here
      assert.deepEqual(counts, [1, 1]); //check if every keyPressed function was called once
    });
  });

  suite('keyTyped', function() {
    test('keyTyped functions on multiple instances must run once', async function() {
      let sketchFn = function(sketch, resolve, reject) {
        let count = 0;
        sketch.keyTyped = function() {
          count += 1;
        };

        sketch.finish = function() {
          resolve(count);
        };
      };
      let sketches = parallelSketches([sketchFn, sketchFn]); //create two sketches
      await sketches.setup; //wait for all sketches to setup
      window.dispatchEvent(new KeyboardEvent('keypress', { key: 'A' })); //dispatch a keyboard event to trigger the keyTyped functions
      sketches.end(); //resolve all sketches by calling their finish functions
      let counts = await sketches.result; //get array holding number of times keyPressed was called. Rejected sketches also thrown here
      assert.deepEqual(counts, [1, 1]); //check if every keyPressed function was called once
    });
  });
});
