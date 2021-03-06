let Processanotificacao = function (lista) {

    this.Iniciar = function (callback) {

        let xhr = new XMLHttpRequest();

        xhr.open('POST', './ws/mail_send.php', true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('cache-control', 'no-cache, must-revalidate, post-check=0, pre-check=0');
        xhr.setRequestHeader('cache-control', 'max-age=0');
        xhr.setRequestHeader('expires', '0');
        xhr.setRequestHeader('expires', 'Tue, 01 Jan 1980 1:00:00 GMT');
        xhr.setRequestHeader('pragma', 'no-cache');
        xhr.timeout = 2880000;
        xhr.responsePrev = '';

        xhr.onloadend = function() {
            callback();
        };

        xhr.onreadystatechange = function() {

            if (xhr.readyState === 4 && xhr.status === 500) {

                let result = JSON.parse(xhr.responseText);

                dhtmlx.message({
                    title: JSON.parse(sessionStorage.auth).title,
                    type: result.tipo,
                    text: result.mensagem
                });

            } else if (xhr.readyState > 2) {

                let new_response = xhr.responseText.substring(xhr.responsePrev.length);

                let result;
                try {

                    if (new_response.length > 0) {

                        result = JSON.parse(new_response);

                        if (result.processamento !== undefined) {
                            if (result.status === 'processando') {

                                let log = '';

                                result.processamento.logtentativas.filter(function (item) {
                                    log += item;
                                });


                                if (result.situacao !== 'Notificado') {
                                    let processamento = {
                                        bloco:result.processamento.bloco,
                                        unidade:result.processamento.unidade,
                                        data:result.processamento.data,
                                        rastreio:result.processamento.rastreio,
                                        id:result.processamento.id,
                                        codigo: parseInt(result.processamento.codigo),
                                        log:log,
                                        destinatarios:result.processamento.destinatarios,
                                        situacao:result.processamento.situacao,
                                        valorsituacao:result.processamento.valorsituacao,
                                        classsituacao:result.processamento.classsituacao
                                    };

                                    let str = "Unidade: #bloco#-#unidade# Situação: #situacao# ";
                                    let text = window.dhx.template(str, processamento);

                                    dhtmlx.message({
                                        text: text,
                                        expire:1000,
                                        type:"customCss" // 'customCss' - css class
                                    });
                                }
                            }
                        }

                    }
                }
                catch(e) {

                    console.exception(e);

                    if (xhr.status === 200) {
                        callback();
                    }
                }

                xhr.responsePrev = xhr.responseText;

            }
        };

        xhr.send(JSON.stringify(lista));

    };

};