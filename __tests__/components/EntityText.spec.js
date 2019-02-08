import { mount, fixtures, baseMountOpts } from 'helper'
import EntityText from '~/components/EntityText'

// TODO: write tests
describe('EntityText component', () => {
  it('Replace patter links with own domain', () => {
    const wrapper = mount(
      EntityText,
      baseMountOpts({
        propsData: {
          content: fixtures('post', 'hasPatterLink').content
        }
      })
    )
    expect(wrapper.text().includes('https://beta.pnut.io/messages/0')).toBe(
      true
    )
  })

  // https://github.com/sunya9/beta/issues/221
  test('Markdown links are displayed correctly', () => {
    const wrapper = mount(
      EntityText,
      baseMountOpts({
        propsData: {
          content: fixtures('post', 'hasMarkdownLink').content
        }
      })
    )
    // hacky: @vue/test-utils does not remove spaces between tags
    // (vue renderer remove all whitespaces between tags default)
    expect(wrapper.text().replace(/\s+/, ' ')).toContain('Beta [beta.pnut.io]')
  })
})
