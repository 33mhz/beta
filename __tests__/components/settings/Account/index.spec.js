import { shallowMount, stub } from 'helper'
import index from '~/components/settings/Account'

describe('settings/Account/index component', () => {
  let wrapper, $toast
  beforeEach(() => {
    wrapper = shallowMount(index, {
      propsData: {
        account: {
          name: 'foo',
          content: {
            text: 'bar'
          },
          timezone: '',
          locale: ''
        }
      },
      stubs: {
        Avatar: stub,
        Cover: stub
      }
    })
    $toast = wrapper.vm.$toast
  })
  describe('success', () => {
    test('show success toast', async () => {
      wrapper.vm.$axios = {
        $patch: jest.fn()
      }
      await wrapper.vm.update()
      expect($toast.success).toHaveBeenCalled()
      expect($toast.error).not.toHaveBeenCalled()
    })
  })
  describe('error', () => {
    test('show error toast', async () => {
      wrapper.vm.$axios = {
        $patch: jest.fn(() => {
          throw new Error()
        })
      }
      await wrapper.vm.update()
      expect($toast.success).not.toHaveBeenCalled()
      expect($toast.error).toHaveBeenCalled()
    })
  })
})
