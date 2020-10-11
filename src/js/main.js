const $ = require("jquery");
import "particles.js/particles";
const particlesJS = window.particlesJS;

particlesJS.load("particles-js", "../particles.json", function () {
  console.log("callback - particles.js config loaded");
});

$(function () {
  /****************************************
このアプリで取得するDOM一覧
*****************************************/
  // ----- タスク追加 -----
  let $getVal = $(".js-get-val");
  let $addTodo = $(".js-add-todo");
  // ----- タスク編集 -----
  let $taskEdit = $(".js-task-edit");
  let $taskEditForm = $(".js-task-edit-form");

  /****************************************
タスク追加の処理
*****************************************/

  $addTodo.on("keypress", function (event) {
    if (event.key !== undefined && event.shiftKey === true) {
      // KeyboardEvent.key でイベントを処理し、handled を true に設定
      console.log("shift + enter が押されています");
      let value = $(this).val();

      // 入力画からだったらエラーメッセージを表示する
      if (!value) {
        $(".js-valid-msg").show();
        $(this).addClass("c-valid__error");
        console.log("入力必須です");
        return;
      }
      $(".js-valid-msg").hide(); // エラーメッセージが表示されていたら入力成功時にメッセージを消す
      $(this).removeClass("c-valid__error");
      $(this).val(""); // 成功時に入力フォーム内の値を消去する
      console.log("入力フォームの値を取得 " + value);

      // 実際のDOM要素を追加する処理
      // 検索機能のためにli要素にdata属性をもたせている
      let taskItem = `<li class="p-task__item js-todo-item" data-text="${value}">
      <i class="c-form__check far fa-circle js-todo-done"></i>
      <div class="p-task__item__wrapp">
        <span class="p-task__item__text js-todo-text-done js-task-edit">${value}</span>
        <input class="c-form c-form__edit js-task-edit-form" placeholder="Shift + Enterキーで編集を完了" type="text" />
      </div>
      <i class="fas fa-trash-alt p-task__trash js-todo-trash"></i></li>`;

      // prepend(引数)：引数で指定したコンテンツを指定した要素の直下の先頭に挿入する。
      $(".js-todo-list").append(taskItem);
    }
  });

  /****************************************
タスクの絞り込み機能
*****************************************/
  // 1. 検索エリアに入力がある度にイベントを発火
  // 2. 全てのタスクリスト要素（js-todo-item）を取得し、ループして展開
  // 3. 検索結果にマッチするもの意外を非表示にする
  $(".js-search").on("keyup", function () {
    let searchValue = $(this).val();

    $(".js-todo-item")
      .show()
      .each(function (index, element) {
        // index：ループの今何番目かが入ってくる
        // element：ループで取り出したDOM（HTML要素）が入ってくる

        // data属性の価を取得して検索用に使う
        let text = $(element).data("text");
        let regexp = new RegExp("^" + searchValue); // 前方一致の条件で検索 正規表現チェッカー http://okumocchi.jp/php/re.php
        console.log(regexp);

        if (text && text.match(regexp)) {
          return true;
        }
        $(element).hide();
      });
  });
  /****************************************
タスクの一括削除
*****************************************/
  $(".js-delete-all").on("click", function () {
    let $jsTodoItem = $(".js-todo-item");
    if (confirm("完了したタスクを消去します。\n よろしいですか？")) {
      if ($jsTodoItem.hasClass("p-task__item--isDone")) {
        $jsTodoItem.each(function (index, elm) {
          if ($(elm).hasClass("p-task__item--isDone")) {
            $(elm).remove();
          }
        });
      }
    }
  });

  /****************************************
 モーダルを開く処理
*****************************************/
  $(".js-other-app").on("click", function () {
    $(".js-modal").fadeIn("slow").siblings(".js-modal-bg").fadeIn("slow");
  });

  /****************************************
 モーダルを閉じる処理
*****************************************/
  $(".js-modal-close").on("click", function () {
    $(".js-modal").fadeOut("slow").siblings(".js-modal-bg").fadeOut("slow");
  });
});

/****************************************
 タスク完了の処理 
*****************************************/
// 新たに追加した要素にもイベントがセットされるように、最初の読み込み時の処理の外に記述する
// documentはhtml要素全てが指定される。第二引数に対象の要素を指定し絞り込む。絞り込まないとどこをクリックしてもイベントが実行される
/*
JavaScriptで要素をオブジェクトとして扱う方法は主に次の２つです。
・jQueryオブジェクト
・DOM要素(DOM Element)
ライブラリを入れてjQuer内で要素を扱うときはjQueryオブジェクトが、
純粋なライブラリなしのJavaScript内で要素を扱うときはDOM要素が使われます。
https://pisuke-code.com/convert-jquery-and-dom-to-each/
*/
$(document).on("click", ".js-todo-done", function () {
  // next()：指定した要素の次にある兄弟要素を取得。そこへ新たにテキスト用のDONEクラスを付けている
  $(this)
    .toggleClass("far fa-circle")
    .toggleClass("fas fa-check-circle")
    .next()
    .toggleClass("p-task__item--isDoneText")
    .closest(".js-todo-item")
    .toggleClass("p-task__item--isDone");
});

/****************************************
タスク削除の処理 
*****************************************/
// ゴミ箱アイコンをクリックしたら、親要素であるli要素を削除する
$(document).on("click", ".js-todo-trash", function () {
  // closest：一番近い親要素を取得する
  $(this)
    .closest(".js-todo-item")
    .fadeOut("slow", function () {
      // $(this)だと、その要素のjQueryオブジェクトが取得できる
      // thisだと、jQueryオブジェクト内のHTML要素が取得できる
      // 動きとしてはどちらも変わらないが、取得しているものが違うので注意
      this.remove();
    });
});

/****************************************
タスク編集の処理 
*****************************************/
$(document).on("dblclick", ".js-task-edit", function () {
  // spanタグ内のテキストを取得
  let value = $(this).text();
  // siblings：兄弟要素をすべて取得。ここでは引数に指定した兄弟要素を取得している
  $(this).hide().siblings(".js-task-edit-form").attr("value", value).show(); // value属性にspanタグで取得したテキストを代入
});

/****************************************
タスク編集の処理の完了
*****************************************/
// テキストボックスでエンターキーがキーアップしたら処理を完了する
$(document).on("keyup", ".js-task-edit-form", function (event) {
  if (event.key !== undefined && event.shiftKey === true) {
    let $this = $(this); // DOMをキャッシュしておく
    let value = $this.val();
    if (!value) {
      $this.addClass("c-valid__error");
      $this.attr("placeholder", "入力必須です");
      return;
    }
    // 1. input要素を非表示
    // 2. 兄弟要素よりjs-task-editクラスのついたspanタグを探してくる
    // 3. その要素のテキスト内容を修正して表示する
    $this.hide().siblings(".js-task-edit").text($this.val()).show();
    $this.removeClass("c-valid__error");
    $this.attr("placeholder", "Shift + Enterキーで編集を完了");
  }
});
// input要素へのフォーカスが外れたときも編集した値を保存する
$(document).on("blur", ".js-task-edit-form", function (event) {
  let $this = $(this); // DOMをキャッシュしておく
  let value = $this.val();
  if (!value) {
    $this.addClass("c-valid__error");
    $this.attr("placeholder", "入力必須です");
    return;
  }
  // 1. input要素を非表示
  // 2. 兄弟要素よりjs-task-editクラスのついたspanタグを探してくる
  // 3. その要素のテキスト内容を修正して表示する
  $this.hide().siblings(".js-task-edit").text($this.val()).show();
  $this.removeClass("c-valid__error");
  $this.attr("placeholder", "Shift + Enterキーで編集を完了");
});
