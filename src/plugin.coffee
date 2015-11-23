tinymce.create('tinymce.plugins.EquationEditorPlugin', {
  init: (editor, url) ->
    editing = null
    codeCogsUrl = 'https://webstudy.codecogs.com/gif.latex?'

    editor.addCommand 'mceMathquill', (existing_latex) ->
      existing_latex ||= ''

      popup = editor.windowManager.open(
        {
          url: 'bower_components/tinymce-dist/plugins/equationeditor/equation_editor.html'
          width: 820,
          height: 400,
          inline: 1,
          popup_css: false,
          title: 'Equation Editor',
          buttons: [
            {
              text: 'insert equation',
              subtype: 'primary',
              onclick: ->
                win = editor.windowManager.getWindows()[0]
                latex = editor.windowManager.getParams()['latexInput'].mathquill('latex')
                editor.execCommand 'mceMathquillInsert', latex
                win.close()
            },
            {
              text: 'cancel',
              onclick: ->
                editing = null
                editor.windowManager.getWindows()[0].close()
            }
          ]
        },
        {
          plugin_url: url,
          existing_latex: existing_latex,
        }
      )

    editor.addCommand 'mceMathquillInsert', (latex) ->
      return unless latex

      content = '''
        &nbsp;
          <img class="rendered-latex" src="'''+ codeCogsUrl + latex + '''"> 
        &nbsp;
      '''

      editor.selection.select(editing) if editing
      editing = null

      editor.selection.setContent(content)

    editor.on 'init', ->
      $(editor.getDoc()).on 'click', '.rendered-latex', (e) ->
        e.stopPropagation()
        editing = @
        latex = $(@).attr('src').replace(codeCogsUrl, '')
        editor.execCommand('mceMathquill', latex)
        console.log(latex)

    editor.addButton 'equationeditor', {
      title: 'Equation editor',
      cmd: 'mceMathquill',
      text: 'f(x)'
    }

    # Use mathquill-rendered-latex when getting the contents of the document
    editor.on 'preProcess', (ed) ->
      mathquills = ed.target.dom.select('.rendered-latex:not(.mathquill-rendered-math)')
      $(mathquills).mathquill()

    # When loading or setting content, render the Mathquill
    editor.on 'loadContent', (ed) ->
      mathquills = ed.target.dom.select('span.rendered-latex:not(.mathquill-rendered-math)')
      $(mathquills).mathquill()

    editor.on 'setContent', (ed) ->
      mathquills = ed.target.dom.select('span.rendered-latex:not(.mathquill-rendered-math)')
      $(mathquills).mathquill()
  ,

  getInfo : ->
    {
      longname:  'Equation Editor',
      author:    'Foraker, derived from https://github.com/laughinghan/tinymce_mathquill_plugin',
      authorurl: 'http://www.foraker.com',
      infourl:   'https://github.com/foraker/tinymce_equation_editor',
      version:   '1.0'
    }
})
tinymce.PluginManager.add('equationeditor', tinymce.plugins.EquationEditorPlugin)
