import RemoveModal from '~/components/RemoveModal'
import BaseModal from '~/components/BaseModal'
import { shallowMount } from 'helper'

describe('Remove modal component', () => {
  let wrapper, baseModalWrapper
  beforeEach(() => {
    wrapper = shallowMount(RemoveModal, {})
    baseModalWrapper = wrapper.find(BaseModal)
  })
  describe('Emitted show event from base-modal', () => {
    beforeEach(() => {
      wrapper.setMethods({
        show: jest.fn()
      })
      const post = {}
      baseModalWrapper.vm.$emit('show', post)
    })
    test('Called show()', () => {
      expect(wrapper.vm.show).toHaveBeenCalled()
    })
    test('Shown the post', () => {
      wrapper.vm.post = {}
      expect(wrapper.find('post-stub').exists()).toBe(true)
    })
  })

  describe('Emitted hidden event from base-modal', () => {
    beforeEach(() => {
      wrapper.setMethods({
        hidden: jest.fn()
      })
      baseModalWrapper.vm.$emit('hidden')
    })

    test('Called hidden()', () => {
      expect(wrapper.vm.hidden).toHaveBeenCalled()
    })
    test('The post is hidden', () => {
      expect(wrapper.find('.list-group').exists()).toBe(false)
    })
  })
})
