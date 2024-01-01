{
    let test_element = document.querySelector("#test-subject");
    window.addEventListener("load", () => 
    {
        console.log("Começando");

        let test_animation_duration = 2000;
        const animation = new KeyframeAnimation
        ({
            html_element: test_element,
            animation_duration: test_animation_duration,
            repeat_initial_state: true,
            is_infinite: false,
            keyframe_struct: test
        });
        
        debug = animation;

        { // teste com estrutura de keyframes CSS nativa
            let test_interval = 0, counter = 1, animation_duration = test_animation_duration/1000;
            test_element.addEventListener("click", (e) =>
            {
                clearInterval(test_interval);
                e.target.style.animation = `test ${animation_duration}s 2`;

                test_interval = setInterval(() =>
                {
                    counter = counter >= animation_duration ? 1 : counter+1;
                    test_element.querySelector("#counter").innerHTML = counter;
                }, 1000)
            })
        }
    })
}

var debug;

let test = 
{
    "25%": 
    {
        "background-color": "rgb(255 0 0)",
        "transform": "rotate(10deg)"
        // "height": "100px",
        // "width": "100px"
    },

    "50%":
    {
        "background-color": "rgb(0 255 0)",
        "transform": "rotate(-10deg)"
    //     "height": "120px",
    //     "width": "120px"
    },

    "75%":
    {
        "background-color": "rgb(0 0 255)",
        "transform": "rotate(10deg)"

        // "height": "150px",
        // "width": "150px",
        // "margin-top": "5%"
    },

    "100%":
    {
        "background-color": "rgb(0 0 0)",
        "transform": "rotate(-10deg)"

        // "height": "150px",
        // "width": "150px",
        // "margin-top": "10%"
    }
}
