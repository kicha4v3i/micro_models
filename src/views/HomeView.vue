<script setup>
import Sidenav from '../components/Sidenav.vue'
import MainInputs from '../components/MainInputs.vue'
import { supabase } from '../lib/supabaseClient.js'


</script>

<template>
    <div class="d-flex">
        <Sidenav />

        <div class="main ms-3 mx-auto mt-3 d-flex justify-content-between">
            <div class="text-left mx-auto w-50 ms-2">
                <h1>Micro Models</h1>
                <p>Micro Models is a simple application that was designed to help you perform simple drilling calculations quickly. 
                    The commonly used equations are categorized according to its use cases and can be seen on the Navigation Panel to the left. 
                    Simply select an equation and enter the appropriate inputs and the calculations are performed instantly
                </p>
                
                <h4>Primary Inputs</h4>
                <p>The inputs that are common to all the equations are segregated out and categorized as the primary inputs. These are located on the right side and are available for all the equations. </p>
            
                <h4>Specific Inputs</h4>
                <p>These are additional inputs that are required for a specific calculation to perform. These are displayed for the required equation model. </p>
            </div>
            <div>
                <MainInputs />
            </div>
        </div>
    </div>
    
</template>
