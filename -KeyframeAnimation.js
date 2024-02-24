class KeyframeAnimation
{
    constructor(params = {})
    {
        console.time('obj-creation');

        // Some RegEx for acceptable map key names
        const timestamp_accepted_key = /^(from|to|\d{1,3}%)$/;
        const CSS_accepted_property_name = /[a-z](?:-[a-z]+)*/;

        // HTML element DOM object *
        this.element;
            if(params.html_element){this.element = params.html_element;}
            else {throw new Error("Required HTMLElement object parameter is not specified.");}

        // Timestamp structure similar to CSS keyframes structure *
        this.keyframes = {};
            if(params.keyframe_struct)
            {
                this.keyframes = params.keyframe_struct && typeof(params.keyframe_struct) === 'object' ? this.objToMap(params.keyframe_struct, timestamp_accepted_key) : undefined;
                if(this.keyframes){this.keyframes.forEach((v, k) => {this.keyframes.set(k, this.objToMap(v, CSS_accepted_property_name));})} // Transforma os objetos de propriedades em mapas também
            }
            else {throw new Error("Required keyframe structure object parameter is not specified.");}
        // TODO: Maybe. Allow animation object to be created without having necessarily a keyframe structure object, or having an empty one.
        
        this.initial_CSS_properties_values = new Map();
        this.repeat_initial_state = params.repeat_initial_state ?? true;
        // TODO: Maybe. Set when the original state should be restored, something like below:
        // this.repeat_initial_state = params.repeat_initial_state && ['end', 'always', 'none'].includes(params.repeat_initial_state) ? params.repeat_initial_state : 'end';

        this.return_to_initial_state = params.return_to_initial ?? true;

        this.is_infinite = params.is_infinite || false;
        this.animation_duration = parseInt(params.animation_duration) || 2000;

        // this.timestamp_functions = this.getTimestampFunctions(this.animation_duration)
        this.animations = this.getAnimations(this.animation_duration);
        this.animation_object = this.getAnimationObject();

        console.timeEnd('obj-creation');

        return this.animation_object;
    }


    objToMap(obj = {}, accepted_expression = / /)
    {
        const map = new Map();

        const accepted_key = accepted_expression;

        for(const obj_key in obj)
        {
            if(!accepted_key.test(obj_key)){console.error("O termo "+"\""+obj_key+"\""+" não é um nome de chave válido no contexto em que foi utilizado."); return;}
            map.set(obj_key, obj[obj_key]);
        }

        return map;
    }



    getAnimations(animation_duration)
    {
        const timestamps = [0];
        const animations = [];
        var timestamp_index = 0;
        var current_timestamp = timestamps[timestamp_index];
        var previous_timestamp = current_timestamp;
        var transition_duration = 0;

        const element = this.element;
        const element_CSS_proprieties = getComputedStyle(this.element);
        const changed_properties = [];

        // Setting boundaries to avoid too complex buildings.
        const forbidden_properties = ["transition-duration", "animation"];

        // Function to get the real values in milliseconds of each timestamp mark string.
        function getTimestamps(key)
        {
            const accepted_values = [/^from$/, /^to$/, /^\d{1,3}%$/];
            const min = 0;
    
            if(accepted_values[0].test(key)){return min;}
            else if(accepted_values[1].test(key)){return this.animation_duration}
            else if(accepted_values[2].test(key))
            {
                let percentage = key.match(/\d{1,3}/)[0];
                if(percentage <= 100 && percentage >= 0)
                {return Math.floor(animation_duration * (percentage/100));}

                else {return min;}
            }
            else{return}
        }


        // Factory functions
        // These functions serve for organization purpose.
        function newStyleAttribFunction(element, p, v)
        {return ()=>{element.style.setProperty(p, v);}}

        function newAnimationFunction(property_change_functions)
        {return ()=> {for(let change of property_change_functions){change()}}}

        function toDefault(element, property_change_functions)
        {
            /*
                Provides a function similar to `newAnimationFunction` with a new `timer` parameter which will define
                how long the animation of "return to default" will take.
                This must always be the last animation function, once it cannot (or shouldn't) be overthrown.
                If no timer is provided, it will run as the standard `newAnimationFunction`, once its time reaches.
            */
            return (timer)=>
            {
                for(let change of property_change_functions){change();}
                element.style.setProperty("transition-duration", `${timer || 0}ms`);
            }
        }
        


        // Operations related to each timestamp|propriety-map pair.
        this.keyframes.forEach((property_array, timestamp) =>
        {
            // Array of style attribution functions
            const property_change_functions = [];

            // Adds the current timestamp to the `timestamps` array.
            timestamps.push(getTimestamps(timestamp)); 
            
            // Updates current timestamp index and value.
            timestamp_index++;
            current_timestamp = timestamps[timestamp_index];
            transition_duration = current_timestamp - previous_timestamp;


            // Set 'transition-duration' property value for the current timestamp changes;
            // Based on timestamp time value.
            property_change_functions.push(newStyleAttribFunction(element, 'transition-duration', transition_duration+"ms"));


            // Property change operations related to each 'propriety|value' pair
            property_array.forEach((value, property) =>
            {
                // If the property is forbidden to change, jump this iteration.
                if(forbidden_properties.includes(property)){return}

                // Set property/value change to the current timestamp
                property_change_functions.push(newStyleAttribFunction(element, property, value));
                
                // Stores up initial values for changed properties.
                if(!(property in changed_properties))
                {this.initial_CSS_properties_values.set(property, element_CSS_proprieties.getPropertyValue(`${property}`));}
                else{changed_properties.push(property)}  
            });

            animations.push({animation: newAnimationFunction(property_change_functions), duration: transition_duration});
            
            previous_timestamp = current_timestamp;
        });
        
        
        // Sets up the "return to default" animation as the last one, retrieving all the element proprieties their initial value.
        const to_default_animation = [];
        this.initial_CSS_properties_values.forEach((value, property) =>
        {to_default_animation.push(newStyleAttribFunction(element, property, value));})

        animations.push({animation: toDefault(element, to_default_animation), duration: 1});


        return animations;
    }



    getAnimationObject()
    {
        console.log(this.repeat_initial_state);
        const animations = this.animations;
        const {animation: returnToInitialState} = this.repeat_initial_state ? animations[animations.length-1] : animations.pop();
        var animation_ID;

        const rtis = this.return_to_initial_state; console.log(rtis);


        function animate(iteration_count)
        {
            var animation_index = 0, animation_length = animations.length;
            var initial_time = null, elapsed_time = 0;
            var current_iteration = 0, is_infinite = !iteration_count;
            
                animation_ID = requestAnimationFrame(render);

            function render(current_time)
            {
                const {animation: play} = animations[animation_index];
                
                if(initial_time === null)
                {initial_time = current_time}

                elapsed_time = current_time - initial_time;

                if(elapsed_time >= animations[animation_index].duration)
                {
                    animation_index++;
                    initial_time = null; // Restart timer
                    elapsed_time = 0; // Restart elapsed time
                }
                
                if(animation_index < animation_length)
                {
                    play();
                    animation_ID = requestAnimationFrame(render);
                }

                // Animation list reaches to its last index...
                else
                {
                    if(is_infinite)
                    {
                        animation_index = 0;
                        animation_ID = requestAnimationFrame(render);
                    }

                    current_iteration++;
                    if(current_iteration < iteration_count)
                    {
                        animation_index = 0;
                        animation_ID = requestAnimationFrame(render)
                    }
                }

            }
        }


        // These will return the actual animation object.
        if(this.is_infinite)
        {
            return {

                start: function(){ if(animation_ID){return}; animate(); },

                finish:
                function(transition_duration)
                {
                    if(!animation_ID){return}

                    if(rtis){returnToInitialState(transition_duration)};
                    cancelAnimationFrame(animation_ID);
                    animation_ID = undefined;
                }
            }
        }

        else
        {
            return {

                play:
                function(iteration_count)
                {
                    const count = iteration_count || 1;
                    animate(count);
                }
            }
        }

    }

}