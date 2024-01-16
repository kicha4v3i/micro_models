<script setup>
import { supabase } from '../lib/supabaseClient.js'
import Login from './Login.vue'

import { ref } from 'vue'
import { useRouter } from 'vue-router'
// Data
const email = ref('')
const password = ref('')
const confirmPass = ref('')
const errorMsg = ref(null)
const emailErrMsg = ref(null)
const router = useRouter()

// Email Check
const emailErr = () => {
    let at = 0
    if (email.value == null || email.value == '') {
        return
    }
    for (let i=0; i<=email.value.length; i++) {
        console.log(email.value[i])
        if (email.value[i] == '@') {
            
            at += 1
        }
    }
    if (at !== 1) {
        emailErrMsg.value = 'Enter valid Email ID'
        setTimeout(() => {
            emailErrMsg.value = null
        }, 3000)
    }
    console.log(at)
}

// Sign Up Function
const signUp = async () => {
    if (password.value == confirmPass.value) {
        try {
            const {data, error} = await supabase.auth.signUp({
                email: email.value,
                password: password.value
            })
            if (error) throw error
            router.push({name:"login"})
        } catch (error) {
            errorMsg.value = error.message
            setTimeout(() => {
                errorMsg.value = null
            }, 3000);
        }
        return
    } else {
        errorMsg.value = 'Error: Passwords do not match'
            setTimeout(() => {
                errorMsg.value = null
            }, 3000);
    }
}

</script>

<template>
    <div class="container-sm mt-5">
        <div class="d-flex flex-column justify-content-center align-items-center">
            <div class="mt-5 px-5 py-5">
                <h3 class="h3">Register your Account</h3>
            </div>
            <div class="mt-1 w-25">
                <label for="email" class="form-label">Email</label>
                <input v-model="email" @focusout="emailErr" type="email" class="form-control" id="email" />
                <p v-if="emailErrMsg" class="position-absolute text-danger">{{ emailErrMsg }}</p>
            </div>
            <div class="mt-4 w-25">
                <label for="password" class="form-label">Password</label>
                <input v-model="password" type="password" class="form-control" id="password" />
            </div>
            <div class="mt-4 w-25">
                <label for="confirmPassword" class="form-label">Confirm Password</label>
                <input v-model="confirmPass" type="password" class="form-control" id="confirmPassword" />
            </div>
            <button @click="signUp" type="submit" class="mt-4 btn btn-primary">Create Account</button>
            <div class="mt-2">
                <p>Already have an account?<router-link class="login" :to="{name: 'login'}"><span class="login"> Login</span></router-link></p>
            </div>
        </div>
        <div v-if="errorMsg">
            <p class="text-danger text-center">{{ errorMsg }}</p>
        </div>
    </div>
</template>

<style scoped>

.h3 {
    font-weight: 600;
    color: rgb(16, 105, 194);
}

label {
    font-weight: 500;
}

button {
    width: 200px;
}

.login {
    text-decoration: none;
    font-weight: 500;
    color:rgb(20, 98, 161)
}

.login:hover {
    color:rgb(57, 156, 237)
}

</style>