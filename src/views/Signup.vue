<template>
  <div class="signup-page mx-auto p-3 w-330">
    <h5 class="my-4 text-center">注册者也账户</h5>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <validate-input
          type="text"
          placeholder="请输入邮箱地址"
          :rules="emailRules"
          v-model="emailVal"
        ></validate-input>
      </div>
      <div class="mb-3">
        <label class="form-label">昵称</label>
        <validate-input
          type="text"
          placeholder="昵称"
          :rules="nameRules"
          v-model="nicknameVal"
        ></validate-input>
      </div>
      <div class="mb-3">
        <label class="form-label">密码</label>
        <validate-input
          type="password"
          placeholder="请输入密码"
          :rules="passwordRules"
          v-model="passwordVal"
        ></validate-input>
      </div>
      <div class="mb-3">
        <label class="form-label">重复密码</label>
        <validate-input
          type="password"
          placeholder="请再次输入密码"
          :rules="repeatPasswordRules"
          v-model="repeatPasswordVal"
        ></validate-input>
      </div>
      <template v-slot:submit>
        <button type="submit" class="btn btn-primary btn-block btn-large">注册新用户</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import ValidateInput, { RulesProps } from '../base/ValidateInput.vue'
import ValidateForm from '../base/ValidateForm.vue'

export default defineComponent({
  name: 'Signup',
  components: {
    ValidateInput,
    ValidateForm
  },
  setup () {
    const emailVal = ref('')
    const emailRules: RulesProps = [
      { type: 'required', message: '电子邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的电子邮箱格式' }
    ]
    const nicknameVal = ref('')
    const nameRules: RulesProps = [
      { type: 'required', message: '昵称不能为空' }
    ]
    const passwordVal = ref('')
    const passwordRules: RulesProps = [
      { type: 'required', message: '密码不能为空' }
    ]
    const repeatPasswordVal = ref('')
    const repeatPasswordRules: RulesProps = [
      { type: 'required', message: '重复密码不能为空' }
    ]

    const router = useRouter()

    const onFormSubmit = (result: boolean) => {
      if (result) {
        router.push('/login')
      }
    }

    return {
      emailVal,
      emailRules,
      nicknameVal,
      nameRules,
      passwordRules,
      passwordVal,
      repeatPasswordVal,
      repeatPasswordRules,
      onFormSubmit
    }
  }
})
</script>
