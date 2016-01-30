Tokenizer
==========

Quando um arquivo texto é carregado, os dados são mantidos em uma representação
interna composta por tokens:

  Token       | Modificadores  | Exemplos
--------------|--------------|-------------
 LITERALS     | INI MID END  | 'example'
 COMMENTS     | LINE INI MID END  | -- comments /**/
 IDENTIFIER   | BRK QUO     | [col] "col"
 SYMBOL       | select 
 WHITESPACE   | space tab
 NUMBER        | 1.0 0x0
 VARIABLES     | @VAR
 TEMPOBJ       | #TEMP
 ESCAPE        | !COMMAND
 PARENTHESIS   | ( and )
 SEMICOLON     | ;
 OPERATORS     | = + - * / &
 EOL
 
TokenType tem os métodos:

* IN: Previous, StartLine, ch[0], ch[1]
* OUT: ch[0], ch[1]
* Test (BOOL)
* Match (SIZE)


  Token       | Modificadores  | TestIn     |    TestOut
--------------|--------------|----------------|------------
 LITERALS     | INI   | ch[0]=='                       | ch[0] ==', ch[1] !='  -- existe \' como escape?
              |  MID |  Previous = LIT_INI or  LIT_MID | ch[0] ==', ch[1] !='
              |  END |  Previous = LIT_INI or  LIT_MID  | ch[0] ==' , ch[1] !='
 COMMENTS     | INI   | ch[0]==/, ch[1]==*              | ch[0]=*, ch[1]=/
              |  MID |  Previous = COM_INI or  COM_MID |  ch[0]=*, ch[1]=/
              |  END |  Previous = COM_INI or  COM_MID  |  ch[0]=*, ch[1]=/
 COMMENTS     | LINE   | ch[0]==-, ch[1]==-          | EOL
 IDENTIFIER   | BRK QUO     | [col] "col"
 SYMBOL       |      |  ch[0]==[a-zA-Z]             | ch[0] != [a-zA-Z0-9](_)
 WHITESPACE   |      |   ch[0] == \s                |  ch[0] != \s
 NUMBER        |  HEX   |   ch[0] == 0, ch[1]==x    |  ch[0] != [0-9a-fA-F]
 NUMBER        |  DIG   |   ch[0] == \d             |  ch[0] != [0-9\.]
 VARIABLES    |  GLOB     |    ch[0]=@ , ch[1]=@   |  ch[0] != [a-zA-Z0-9]
 VARIABLES    |  LOCL     |    ch[0]=@                |  ch[0] != [a-zA-Z0-9]
 TEMPOBJ    |  GLOB     |    ch[0]=# , ch[1]=#   |  ch[0] != [a-zA-Z0-9]
 TEMPOBJ    |  LOCL     |    ch[0]=#                |  ch[0] != [a-zA-Z0-9]
 ESCAPE        | !COMMAND
 PARENTHESIS   | ( and )
 SEMICOLON     | ;
 OPERATORS     | <> = + - * / &
 
 
O objetivo é reconhecer visualmente:

* Comentários
* Strings
* Tabelas de sistema
* Colunas
* Symbol table (highlights)