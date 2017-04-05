$(document).ready(function() {
    var knowledgeId = $('#knowledgeId').val();
    if (knowledgeId) {
        $('#survey_info').addClass('hide');
        $('#survey_edit').removeClass('hide');
        document._TEMPLATE.editable = true;
        $('#items').html('');
        document.__load_survey(_CONTEXT + '/protect.survey/load/' + knowledgeId);
    }
    
    $('#deletebutton').click(function(){
        var knowledgeId = $('#knowledgeId').val();
        bootbox.confirm("Are you sure delete?", function(result) {
            if (result) {
                $.ajax({
                    url: _CONTEXT + '/protect.survey/delete/' + knowledgeId,
                    type: 'DELETE',
                    timeout: 10000  // 単位はミリ秒
                }).done(function(result, textStatus, xhr) {
                    $.notify(result.message, 'success');
                }).fail(function(xhr, textStatus, error) {
                    handleErrorResponse(xhr, textStatus, error);
                });
            }
        }); 
    });
    
    $('#btnShowAnswer').click(function(){
        $('#editSurvey').modal('hide');
        $('#modalAnswerSurvey').modal('show');
    });
    
    // フォームのサブミットは禁止
    $('#surveyForm').submit(function(event) {
        logging('submit. ' + $('#typeId').val());
        // 操作対象のフォーム要素を取得
        var $form = $(this);
        // ページ遷移を禁止して、Ajaxで保存
        event.preventDefault();
        
        // 送信ボタンを取得
        // （後で使う: 二重送信を防止する。）
        var $button = $form.find('button');
        
        // ボタンを無効化し、二重送信を防止
        $button.attr('disabled', true);
        // 送信
        $.ajax({
            url: $form.attr('action'),
            type: $form.attr('method'),
            data: $form.serialize(),
            timeout: 10000,  // 単位はミリ秒
        }).done(function(result, textStatus, xhr) {
            // 入力値を初期化
            console.log(result);
            $.notify(result.message, 'info');
            if ($form.attr('action') == (_CONTEXT + '/protect.survey/delete')) {
                // 削除完了時の処理
            }
            $('#deletebutton').removeClass('hide');
        }).fail(function(xhr, textStatus, error) {
            handleErrorResponse(xhr, textStatus, error);
        }).always(function( jqXHR, textStatus ) {
            // ボタンを有効化し、再送信を許可
            $button.attr('disabled', false);
        });
        return false;
    });
    
});