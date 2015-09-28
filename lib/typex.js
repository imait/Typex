// -*- coding: utf-8-unix; mode: javascript -*-

// Typex: typing exercise
// 
// Typex, typing exercise is a programme with ajax like interface.
// 
// Author: 2007 IMAI Toshiyuki
// 
// Copyright (c) 2007 IMAI Toshiyuki
// 
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php

var http_request = undefined;
var listfile = './resources/list.json';
var resdir = './resources/';

function sendKey(event) {
    var charcode = event.keyCode;
    if (charcode == 0) {
        charcode = event.charCode;
    }
    if (ttext != undefined) {
        if (stime == undefined) {
            stime = new Date();
            updateTimeTable();
        } else if (etime != undefined) {
            var tf = document.getElementById('TYPEFIELD');
            tf.value = '';
            tf.focus();
            if (nexttask != undefined) {
                setTask(nexttask);
            }
            return;
        }

        if (ttext.length == 0) {
            if (charcode == 13) {
                clno++;
                if (ttexts[clno] != undefined && ttexts[clno].length == 0) {
                    replaceLeftText(ttexts[clno] + '[Type Return]');
                } else {
                    replaceLeftText(ttexts[clno]);
                }
                replaceNextText(ttexts[(clno + 1)]);
                var temp = ttexts[clno];
                if (temp != undefined) {
                    ttext = temp.replace(/\s\s+/g, ' ');
                }
                clearOkText();
            } else {
                if (charcode != 8 && charcode != 9) {
                    addNumOfErrors();
                }
            }
        } else {
            var char = String.fromCharCode(charcode);
            var tchar = ttext.substring(0, 1);
            if (char == tchar) {
                var ok = document.getElementById('OK');
                var textNode = document.createTextNode(char);
                ok.appendChild(textNode);
                ttext = ttext.slice(1, ttext.length);
                if (ttext.length == 0) {
                    replaceLeftText(ttext + ' [Type Return]');
                } else {
                    replaceLeftText(ttext);
                }
            } else {
                if (charcode != 8 && charcode != 9) {
                    addNumOfErrors();
                }
            }
        }
    }

    var tf = document.getElementById('TYPEFIELD');
    tf.value = '';
    tf.focus();
}

function replaceLeftText(string) {
    if (string == undefined) {
        etime = new Date();
        ptime = new Date();
        ptime.setTime((etime.getTime() - stime.getTime()) + (ptime.getTimezoneOffset() * 60000));
        updateTimeTable();
        if (nexttask == undefined) {
            string = '[END]';
        } else {
            string = '[Type Any Key to get to Next Task]';
        }
    }
    var cline = document.getElementById('CURRENTLINE');
    var left = document.getElementById('LEFT');
    var newLeft = document.createElement('span');
    newLeft.setAttribute('id', 'LEFT');
    var textNode = document.createTextNode(string);
    newLeft.appendChild(textNode);

    cline.replaceChild(newLeft, left);
}

function clearOkText() {
    var cline = document.getElementById('CURRENTLINE');
    var ok = document.getElementById('OK');
    var newOk = document.createElement('em');
    newOk.setAttribute('id', 'OK');
    var textNode = document.createTextNode('');
    newOk.appendChild(textNode);
    cline.replaceChild(newOk, ok);
}

function replaceNextText(string) {
    if (string == undefined) {
        string = '';
    } else if (string == '') {
        string = String.fromCharCode(160);
    }
    var task = document.getElementById('TASKTEXT');
    var nline = document.getElementById('NEXTLINE');
    var newNline = document.createElement('p');
    newNline.setAttribute('id', 'NEXTLINE');

    if (string.length > 50) {
        string = string.substring(0, 50);
        string = string + '...';
    }
    var textNode = document.createTextNode(string);
    newNline.appendChild(textNode);

    task.replaceChild(newNline, nline);
}

function replaceTaskTitle(string) {
   if (string == undefined) {
        string = '';
    }
    var task = document.getElementById('TASKTEXT');
    var taskTitle = document.getElementById('TASKTITLE');
    var newTaskTitle = document.createElement('h2');
    newTaskTitle.setAttribute('id', 'TASKTITLE');

    var textNode = document.createTextNode(string);
    newTaskTitle.appendChild(textNode);

    task.replaceChild(newTaskTitle, taskTitle);
}

function addNumOfErrors() {
    errorcount++;
    var notice = document.getElementById('NOTICE');
    var nerror = document.getElementById('NUM_ERRORS');
    var newnerror = document.createElement('p');
    newnerror.setAttribute('id', 'NUM_ERRORS');
    var textNode = document.createTextNode('Errors: ' + errorcount);
    newnerror.appendChild(textNode);

    notice.replaceChild(newnerror, nerror);
}

function clearNumOfErrors() {
    errorcount = 0;
    var notice = document.getElementById('NOTICE');
    var nerror = document.getElementById('NUM_ERRORS');
    var newnerror = document.createElement('p');
    newnerror.setAttribute('id', 'NUM_ERRORS');

    notice.replaceChild(newnerror, nerror);
}

function setup() {
    if (ttexts.length == 0) {
        ttexts = ['Four score and seven years ago our fathers brought forth on this continent, a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal.',
'Now we are engaged in a great civil war, testing whether that nation, or any nation so conceived and so dedicated, can long endure. We are met on a great battle-field of that war. We have come to dedicate a portion of that field, as a final resting place for those who here gave their lives that that nation might live. It is altogether fitting and proper that we should do this.',
'But, in a larger sense, we can not dedicate -- we can not consecrate -- we can not hallow -- this ground. The brave men, living and dead, who struggled here, have consecrated it, far above our poor power to add or detract. The world will little note, nor long remember what we say here, but it can never forget what they did here. It is for us the living, rather, to be dedicated here to the unfinished work which they who fought here have thus far so nobly advanced. It is rather for us to be here dedicated to the great task remaining before us -- that from these honored dead we take increased devotion to that cause for which they gave the last full measure of devotion -- that we here highly resolve that these dead shall not have died in vain -- that this nation, under God, shall have a new birth of freedom -- and that government of the people, by the people, for the people, shall not perish from the earth.'];
    }

    if (ttitle == undefined) {
        ttitle = 'The Gettysburg Address by Abraham Lincoln';
    }

    replaceTaskTitle(ttitle);

    stime = undefined;
    etime = undefined;
    ptime = undefined;
    updateTimeTable();
    clno = 0;
    replaceLeftText(ttexts[clno]);
    replaceNextText(ttexts[(clno + 1)]);
    var temp = ttexts[clno];
    if (temp != undefined) {
        ttext = temp.replace(/\s\s+/g, ' ');
    }
    clearOkText();
    clearNumOfErrors();

    var tf = document.getElementById('TYPEFIELD');
    tf.value = '';
    tf.focus();
}

function updateTimeTable() {

    var updateTT = function(ttime, tid) {
        var rt = document.getElementById(tid + 'R');
        var et = document.getElementById(tid);
        var nt = document.createElement('td');
        var textNode;
        if (ttime == undefined) {
            textNode = document.createTextNode('00:00:00');
        } else {
            var hour = ttime.getHours();
            var min = ttime.getMinutes();
            var sec = ttime.getSeconds();
            var strTime = new String();
            if (sec < 10) {
                strTime = ':0' + sec;
            } else {
                strTime = ':' + sec;
            }
            if (min < 10) {
                strTime = ':0' + min + strTime;
            } else {
                strTime = ':' + min + strTime;
            }
            if (hour < 10) {
                strTime = '0' + hour + strTime;
            } else {
                strTime = hour + strTime;
            }
            textNode = document.createTextNode(strTime);
        }
        nt.setAttribute('id', tid);
        nt.appendChild(textNode);
        rt.replaceChild(nt, et);
    }

    updateTT(stime, 'STIME');
    updateTT(etime, 'ETIME');
    updateTT(ptime, 'PTIME');
}

function getListMenu() {
    var listmenu = document.getElementById('LISTMENU');

    if (window.XMLHttpRequest) {
        http_request = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        http_request = new ActiveXObject('Microsoft.XMLHTTP');
    }

    http_request.onreadystatechange = function(){
        if (http_request.readyState == 4) {
            if (http_request.status == 200) {
                var result = eval('(' + http_request.responseText + ')');
                for (var i = 0; i < result.length; i++) {
                    var elementNode = document.createElement('option');
                    var textNode = document.createTextNode(result[i]['title']);
                    elementNode.setAttribute('value', result[i]['file']);
                    elementNode.appendChild(textNode);
                    listmenu.appendChild(elementNode);
                }
            } else {
                if (http_request.responseText && http_request.status == 0) {
                    var result = eval('(' + http_request.responseText + ')');
                    for (var i = 0; i < result.length; i++) {
                        var elementNode = document.createElement('option');
                        var textNode = document.createTextNode(result[i]['title']);
                        elementNode.setAttribute('value', result[i]['file']);
                        elementNode.appendChild(textNode);
                        listmenu.appendChild(elementNode);
                    }
                }
            }
        } else {

        }
    };

    http_request.open('get', listfile);
    http_request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    http_request.send(null);
}

function getTaskMenu() {
    var taskmenu = document.getElementById('TASKMENU');
        var cnodes = taskmenu.childNodes;
        ccount = cnodes.length;
        for (var i = 0; i < ccount; i++) {
            var cnode = cnodes[0];
            taskmenu.removeChild(cnode);
        }

    if (window.XMLHttpRequest) {
        http_request = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        http_request = new ActiveXObject('Microsoft.XMLHTTP');
    }

    http_request.onreadystatechange = function(){
        if (http_request.readyState == 4) {
            if (http_request.status == 200) {
                var result = eval('(' + http_request.responseText + ')');
                for (var i = 0; i < result.length; i++) {
                    var elementNode = document.createElement('option');
                    var textNode = document.createTextNode(result[i]['title']);
                    elementNode.setAttribute('value', result[i]['file']);
                    elementNode.appendChild(textNode);
                    taskmenu.appendChild(elementNode);
                }
            } else {
                if (http_request.responseText && http_request.status == 0) {
                    var result = eval('(' + http_request.responseText + ')');
                    for (var i = 0; i < result.length; i++) {
                        var elementNode = document.createElement('option');
                        var textNode = document.createTextNode(result[i]['title']);
                        elementNode.setAttribute('value', result[i]['file']);
                        elementNode.appendChild(textNode);
                        taskmenu.appendChild(elementNode);
                    }
                }
            }
        } else {

        }
    };


    var listmenu = document.getElementById('LISTMENU');
    tlist = listmenu.value;
    var filepath = resdir + tlist;

    http_request.open('get', filepath);
    http_request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    http_request.send(null);


}

function setTask(task) {
    if (task == undefined) {
        var taskmenu = document.getElementById('TASKMENU');
        task = taskmenu.value;
    }

    if (window.XMLHttpRequest) {
        http_request = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        http_request = new ActiveXObject('Microsoft.XMLHTTP');
    }

    if (task != null && task != 'null') {
        var filepath = resdir + task;

        http_request.onreadystatechange = function(){
            if (http_request.readyState == 4) {
                if (http_request.status == 200) {
                    var result = eval('(' + http_request.responseText + ')');
                    ttitle = result['title'];
                    ttexts = result['task'];
                    nexttask = result['next'];
                    setup();
                } else {
                    if (http_request.responseText && http_request.status == 0) {
                        var result = eval('(' + http_request.responseText + ')');
                        ttitle = result['title'];
                        ttexts = result['task'];
                        nexttask = result['next'];
                        setup();
                    }
                }
            } else {
                
            }
        };
        http_request.open('get', filepath);
        http_request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        http_request.send(null);
    }
}
