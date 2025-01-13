import { Extension } from '@tiptap/core';

export const AutoPageBreak = Extension.create({
  name: 'autoPageBreak',

  addOptions() {
    return {
      pageHeight: 9 * 96, // 9 inches in pixels (excluding margins)
    }
  },

  onCreate() {
    this.setupPageBreakHandler()
  },

  onUpdate() {
    this.setupPageBreakHandler()
  },

  setupPageBreakHandler() {
    const { editor } = this

    // Get all pages
    const pages = editor.view.dom.querySelectorAll('.editor-page')
    
    pages.forEach(page => {
      const content = page.querySelector('.ProseMirror')
      const contentHeight = content.scrollHeight
      
      // If content overflows current page
      if (contentHeight > this.options.pageHeight) {
        // Find the overflowing paragraph
        const paragraphs = Array.from(content.querySelectorAll('p'))
        let totalHeight = 0
        let overflowingParagraph

        for (const p of paragraphs) {
          totalHeight += p.offsetHeight
          if (totalHeight > this.options.pageHeight) {
            overflowingParagraph = p
            break
          }
        }

        if (overflowingParagraph) {
          // Create a new page
          const newPage = this.createNewPage()
          
          // Move overflowing content to new page
          let currentNode = overflowingParagraph
          const nodesToMove = []
          
          while (currentNode) {
            nodesToMove.push(currentNode)
            currentNode = currentNode.nextSibling
          }
          
          nodesToMove.forEach(node => {
            newPage.querySelector('.ProseMirror').appendChild(node)
          })
        }
      }
    })
  },

  createNewPage() {
    const { editor } = this
    const container = editor.view.dom.closest('.editor-pages-container')
    
    const newPage = document.createElement('div')
    newPage.className = 'editor-page'
    newPage.innerHTML = '<div class="ProseMirror"></div>'
    
    container.appendChild(newPage)
    return newPage
  }
}) 