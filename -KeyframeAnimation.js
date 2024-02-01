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
        this.repeat_initial_state = params.repeat_initial_state || true;
        // TODO: Maybe. Set when the original state should be restored, something like below:
        // this.repeat_initial_state = params.repeat_initial_state && ['end', 'always', 'none'].includes(params.repeat_initial_state) ? params.repeat_initial_state : 'end';

        this.is_infinite = params.is_infinite || false;
        this.animation_duration = parseInt(params.animation_duration) || 2000;

        this.timestamp_functions = this.getTimestampFunctions(this.animation_duration)
        this.animation_object = this.getAnimationObject();

        console.timeEnd('obj-creation');

        return this.animation_object;
    }


    objToMap(obj = {}, accepted_expression = / /)
    {
        const map = new Map();

        const accepted_key = accepted_expression;
        // console.log(accepted_expr);

        for(const obj_key in obj)
        {
            if(!accepted_key.test(obj_key)){console.error("O termo "+"\""+obj_key+"\""+" não é um nome de chave válido no contexto em que foi utilizado."); return;}
            map.set(obj_key, obj[obj_key]);
        }

        return map;
    }



    getTimestampFunctions(animation_duration)
    {
        const timestamps = [0];
        var timestamp_index = 0;
        var current_timestamp = timestamps[timestamp_index];
        var previous_timestamp = current_timestamp;
        var transition_duration = 0;

        const element = this.element;
        const element_CSS_proprieties = getComputedStyle(this.element);
        const changed_properties = [];

        // Time tracked functions to be executed each animation loop in their respective time
        const timestamp_functions = [];
        

        // Function to get the real values in milliseconds of each timestamp mark string.
        function getTimestamps(key)
        {
            const accepted_values = [/^from$/, /^to$/, /^\d{1,3}%$/];
    
            if(accepted_values[0].test(key)){return 0}
            else if(accepted_values[1].test(key)){return this.animation_duration}
            else if(accepted_values[2].test(key))
            {
                let percentage = key.match(/\d{1,3}/)[0];
                if(percentage <= 100 && percentage >= 0)
                {return Math.floor(animation_duration * (percentage/100));}
    
                else {return 0;} // Considering 
            }
            else{return}
        }


        // Factory functions
        // These functions serve for organization purpose.
        function newStyleAttribFunction(element, p, v){return ()=>{element.style.setProperty(p, v);}}

        function newTimeoutFunction(property_change_functions, timer = 100)
        {return () => setTimeout(() => {for(let change of property_change_functions){ change(); } }, timer);}
        
        function restoreInitialStateFunction(element, original_states, timer)
        {
            return function(transition_duration)
            {
                setTimeout(()=>{
                    element.style.setProperty('transition-duration', `${transition_duration || 10}ms`);
                    original_states.forEach
                    ((value, property) => {element.style.setProperty(property, value)});
                }, timer);
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
                // Set property/value change to the current timestamp
                property_change_functions.push(newStyleAttribFunction(element, property, value));
                

                // Stores up initial values for changed properties.
                if(!(property in changed_properties))
                {this.initial_CSS_properties_values.set(property, element_CSS_proprieties.getPropertyValue(`${property}`));}
                else{changed_properties.push(property)}  
            });


            // Pushes a new timeout function to be executed in the animation loop;
            // Executes as a setTimeout() function, looping through all property changes.
            timestamp_functions.push(newTimeoutFunction(property_change_functions, previous_timestamp));
            

            previous_timestamp = current_timestamp;
        });

        // Adds a last function to retrieve the element initial values, if `this.repeat_initial_state` is true
        if(this.repeat_initial_state){ timestamp_functions.push(restoreInitialStateFunction(element, this.initial_CSS_properties_values, 100)); }
        
        
        return timestamp_functions;


        // TODO: Corrigir problema com o valor de 'transition-duration' no retorno à primeira função a partir da última.
    }



    getAnimationObject()
    {
        const animation_duration = this.animation_duration;
        var animation_interval_ID;
        var animations_IDs = [];

        const timestamp_functions = this.timestamp_functions;
        const return_to_initial = timestamp_functions.pop();

        function executeTimestampFunctions()
        {
            for (let action of timestamp_functions)
            {animations_IDs.push(action());}
        }

        if(this.is_infinite)
        {
            return {

                start:
                function()
                {
                    if(animation_interval_ID){return;}

                    executeTimestampFunctions();

                    animation_interval_ID = setInterval(()=>
                    {
                        executeTimestampFunctions();
                    }, animation_duration);
                },

                finish:
                function(transition_duration)
                {
                    if(animation_interval_ID)
                    {
                        clearInterval(animation_interval_ID);
                        for(let id of animations_IDs){clearTimeout(id);}

                        // Cleans registers for both `setInterval` and `setTimeout` functions respective IDs
                        animation_interval_ID = undefined;
                        animations_IDs = [];

                        return_to_initial(transition_duration || 100);
                    }

                    else{return;}
        }}}

        else
        {
            return {

                play:
                function(iteration_count = 1)
                {
                    let i = 0;

                    for(; i < iteration_count; i++)
                    {
                        setTimeout(()=>{for(let action of timestamp_functions){action()}}, animation_duration*i);
        }}}}
    }

}
