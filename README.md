# Connect-4-with-Machine-Learning
A version of the popular game connect 4 that uses a combination of machine learning and basic hard-coded game play procedures in order for the application to improve its game playing skills

In this version of connect 4, I have hard coded procedures, in JavaScript, in order for the application to achieve basic moves and counter moves.  However, if the application can move freely and not have to perform a blocking move or a winning move, an Ajax call is sent to Python in which a custom algorithm and sql query is run on stored winning and losing moves. The application uses weights to determine the best move to make. After every win or loss, the application sends another Ajax call and stores all of the moves and meta data about the moves in order to increase its ability to learn.

You can play the game here: http://52.3.253.86/sample1/home/index
