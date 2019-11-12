import React, { useEffect } from 'react'
import DocumentMeta from 'react-document-meta';
import { FaBars } from "react-icons/fa";

const Decks = () =>{
  useEffect(() => {
    var hash = document.location.hash
    if (hash != "") {
      $('a[href="' + hash + '"]').tab('show')
    }
  }, [])

  return (
    <DocumentMeta title="FAQ - Decks">
      <div className='container my-3'>
        <div className="card">
          <div className="card-header">
            <ul className="nav nav-pills" role="tablist">
              <li className="nav-item">
                <a className="nav-link active" id="how-to-create-tab" data-toggle="pill" href="#how-to-create" role="tab" aria-controls="how-to-create" aria-selected="true">How do I to create?</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" id="how-to-format-tab" data-toggle="pill" href="#how-to-format" role="tab" aria-controls="how-to-format" aria-selected="false">Card text formats</a>
              </li>
            </ul>
          </div>
          <div className="card-body tab-content">
            <div className="tab-pane fade show active" id="how-to-create" role="tabpanel" aria-labelledby="how-to-create-tab">
              <div className="alert alert-warning" role="alert">
                You have to be logged in to be able to access this feature
              </div>

              If you can see the word "Decks" on the top navigation bar: 
              <ol>
                <li>In the Top navigation bar, hover your mouse over (click if using mobile devices) the "Decks" button</li>
                <li>Select Add decks</li>
              </ol>

              If you see "<FaBars />" in the top navigation bar:
              <ol>
                <li>In the Top navigation bar, click on the "<FaBars />" button</li>
                <li>Click on the "Decks" button</li>
                <li>Select Add decks</li>
              </ol>
              Once you completed the above instructions you will be brought to the "Add decks page"<br />
              Details that are needed:
              <ul>
                <li>The title of the deck</li>
                <li>At least 6 cards (Details filled in, Back sub is optional)</li>
              </ul>
              To add more cards click on the "Add card" button right at the bottom of the page.<br />
              Alternatively you can add a card in between 2 cards by clicking on the "Insert Above" button located at the top right on every card.<br />
              To rearrage cards, you will have to drag the card you want by clicking on the "<FaBars />" icon beside every card number.<br />
              To delete cards, click on the "Delete" button on the card you want to delete located at the rop right of every card.<br />
              <br />
              Finally, click on "Add deck" when you are done.<br />
              Once the deck is saved in the servers you will be redirected to it directly!<br />
              <br />
              We hope you enjoy using Flash Learn :)
            </div>
            <div className="tab-pane fade" id="how-to-format" role="tabpanel" aria-labelledby="how-to-format-tab">
              <div className="mb-4">
                <h2>Table of contents</h2>
                <ul>
                  <li><a href="#bold">Bold</a></li>
                  <li><a href="#strikethrough">Strikethrough</a></li>
                  <li><a href="#underline">Underline</a></li>
                  <li><a href="#superscript">Superscript</a></li>
                  <li><a href="#subscript">Subscript</a></li>
                  <li><a href="#break-line">Break line</a></li>
                  <li><a href="#text-above-text">Text above text</a></li>
                </ul>
              </div>
              <div id="bold" className="exampleAndcode">
                <h2>Bold</h2>
                <p>Using the <code>[b][/b]</code> tag you will be bold any part of your text</p>
                <div className="example">
                  I want to <b>bold</b> this word
                </div>
                <pre>
                  <code>I want to [b]bold[/b] this word</code>
                </pre>
              </div>
              <div id="strikethrough" className="exampleAndcode">
                <h2>Strikethrough</h2>
                <p>Using the <code>[s][/s]</code> tag you will be strikethrough any part of your text</p>
                <div className="example">
                  I want to <s>strike</s> this word
                </div>
                <pre className="code">
                  I want to [s]strike[/s] this word
                </pre>
              </div>
              <div id="underline" className="exampleAndcode">
                <h2>Underline</h2>
                <p>Using the <code>[u][/u]</code> tag you will be underline any part of your text</p>
                <div className="example">
                  I want to <u>underline</u> this word
                </div>
                <pre className="code">
                  I want to [u]underline[/u] this word
                </pre>
              </div>
              <div id="superscript" className="exampleAndcode">
                <h2>Superscript</h2>
                <p>Using the <code>[sup][/sup]</code> tag you will be superscript any part of your text</p>
                <div className="example">
                  I want to <sup>superscript</sup> this word
                </div>
                <pre className="code">
                  I want to [sup]superscript[/sup] this word
                </pre>
              </div>
              <div id="subscript" className="exampleAndcode">
                <h2>Subscript</h2>
                <p>Using the <code>[sub][/sub]</code> tag you will be subscript any part of your text</p>
                <div className="example">
                  I want to <sub>subscript</sub> this word
                </div>
                <pre className="code">
                  I want to [sub]subscript[/sub] this word
                </pre>
              </div>
              <div id="break-line" className="exampleAndcode">
                <h2>Break line</h2>
                <p>Using the <code>\n</code> tag you will move any other text after it to the next line</p>
                <div className="example">
                  I want to separate this sentence<br />
                  from this sentence
                </div>
                <pre className="code">
                  I want to separate this sentence \n
                  from this sentence
                </pre>
              </div>
              <div id="text-above-text" className="exampleAndcode">
                <h2>Text above text</h2>
                <p>It is a small extra text, that is attached to the top of the main text to indicate pronunciation / meaning of the character</p>
                <p>
                  Using the <code>[rby=][/rby]</code> tag you will be able to add extra text to the top of text<br />
                  Text that comes after the '=' sign but will in the '[]' will be added to the top of the main text
                </p>
                <div className="example">
                  <ruby>僕<rt>ぼく</rt></ruby>は、<ruby>君<rt>きみ</rt></ruby>を<ruby>愛<rt>あい</rt></ruby>しています
                </div>
                <pre className="code">
                  [rby=ぼく]僕[/rby]は、[rby=きみ]君[/rby]を[rby=あい]愛[/rby]しています
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DocumentMeta>
  )
}

export default Decks
