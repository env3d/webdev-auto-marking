
window.addEventListener('load', () => {

    // Check if window has been programmatically opened
    if (window.name.length > 0) return;
    
    let iframe = document.createElement('iframe');
    //iframe.src = 'spec.html';
    
    iframe.style.borderStyle = 'none';
    iframe.style.width = '80%';
    iframe.style.height = '80%';
    iframe.style.position = 'fixed';
    iframe.style.top = '10%';
    iframe.style.left = '10%';
    iframe.style.opacity = '0.8';    

    iframe.srcdoc =
    
    [`<html>`,
     `  <head>`,
     `    <link rel="shortcut icon" type="image/png"`,
     `          href="https://cdnjs.cloudflare.com/ajax/libs/jasmine/3.2.1/jasmine_favicon.png">`,     
     `    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jasmine/3.2.1/jasmine.css">`,
     `    <script src="https://cdnjs.cloudflare.com/ajax/libs/jasmine/3.2.1/jasmine.js"></script>`,
     `    <script src="https://cdnjs.cloudflare.com/ajax/libs/jasmine/3.2.1/jasmine-html.js"></script>`,
     `    <script src="https://cdnjs.cloudflare.com/ajax/libs/jasmine/3.2.1/boot.js"></script>`,
     `  </head>`,
     `  <body>`,
     `    <script>`,
     `      (${test.toString()})()`,
     `    </script>`,
     `  </body>`,
     `</html>`
    ].join('\n');    
    
    document.body.append(iframe);    
});

var test = function() {
    var summary = { passed:[], failed:[] };
    var reporter = {        
        
        specDone: function(results){
            console.log(results);
            if (results.status == 'passed') {
                summary.passed.push(results.description);
            } else {
                summary.failed.push(results.description);                
            }
        },
        
        suiteDone: function(results){
            console.log(summary);
            // here we can send the summary to our server
        }
        
    }
    
    jasmine.getEnv().addReporter(reporter);

    describe("Assignment 1", function() {

        let testWindow;        
        
        beforeAll(function(done) {

            // extract name and student number
            let meta = parent.document.querySelectorAll('meta');
            for (let i=0; i<meta.length; i++) {
                let name = meta[i].getAttribute('name');
                if (name) {
                    summary[name] = meta[i].getAttribute('content');
                }
            }

            testWindow = window.open(parent.location.href,'myTestWindow','width=800,height=600');
            testWindow.addEventListener('load', function() {
                done();
            });
        });

        afterAll(function() {
            testWindow.close();
            //parent.window['jasmine'] = jasmine;
            //console.log(jasmine);
        });
        
        it("Have header element", function() {
            var hElements = testWindow.document.querySelectorAll('h1');
            
            expect(hElements.length).toBe(1, 'I only want 1 h1 element');
        });
        
        it("Have ul element", function() {
            var elem = testWindow.document.querySelectorAll('ul');
            expect(elem.length).toBe(1, 'I only want 1 ul element');

            expect(elem[0].childElementCount).toBe(1);
            
        });

        it("final style test", function() {            
            var elem = testWindow.document.querySelector('h1');
            var style = getComputedStyle(elem);
            expect(style.fontSize).toBe('16px');
        });

        it("Style sheet test", function() {
            for (let i = 0; i<testWindow.document.styleSheets.length; i++) {
                console.log(testWindow.document.styleSheets[i]);
                for (let j = 0; j<testWindow.document.styleSheets[i].rules.length; j++) {
                    console.log(testWindow.document.styleSheets[i].rules[j].selectorText);
                }
            }

            expect(testWindow.document.styleSheets.length).toBe(2);            
        });

        it('Small media test', function(done) {
            let test = () => {
                let style = testWindow.getComputedStyle(testWindow.document.body);
                expect(style.backgroundColor).toBe('rgb(173, 216, 230)');
                setTimeout(() => {
                    testWindow.removeEventListener('resize',test);
                    done();
                },0);        
            }
            
            testWindow.addEventListener('resize', test);
            testWindow.resizeTo(500,600);            
        });
       
        it('large media test', function(done) {
            let test = () => {
                let style = testWindow.getComputedStyle(testWindow.document.body);
                expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)');
                setTimeout(() => {
                    testWindow.removeEventListener('resize',test);
                    done();
                },0);        
            }
            
            testWindow.addEventListener('resize', test);
            testWindow.resizeTo(800,600);
        });

    }); 
};
