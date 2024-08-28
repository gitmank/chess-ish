# hitwicket_task_Manomay_21BCY10052
chess-like game with 5x5 board
> [!NOTE]
> This project is deployed at https://chess-ish.manomay.co  
> To run it locally, follow the below steps

## Run on local machine
1. Edit the sample environment files - `client/.env.local` and `server/.env`.
2. Run `npm install` in `/client` and `/server`.
3. Start the Next.js app by running `npm run dev` in `/client`.
4. Start the socket.io server by running `npm start` in `/server`.
5. You need to have Node.js and npm installed to run the project.

## Game Rules
- 5x5 board with 2 players
- 5 pieces per player
- Pieces move in specific ways 
- First to capture all opponent's pieces wins

## Piece Types
![Screenshot 2024-08-25 at 11 01 57 PM](https://github.com/user-attachments/assets/ec7812b6-5cdc-4a45-86c7-76866eb83a79)
![Screenshot 2024-08-25 at 11 03 54 PM](https://github.com/user-attachments/assets/e2f337a3-0597-4965-be8e-d6691caf77b2)
![Screenshot 2024-08-25 at 11 05 27 PM](https://github.com/user-attachments/assets/63ac77e8-9aee-4cd5-8bd9-0febf14273f0)

## Invalid Moves
- stay in bounds of the board
- no friendlies should be attacked when piece moves
- character and allowed moves don't match

## Simple bonus
- team combo
- spectate
- chat
- vs Computer
- replay match
- player rank

## Advanced bonus
> save for last

![Screenshot 2024-08-25 at 11 11 36 PM](https://github.com/user-attachments/assets/8622a8cd-4251-4fc0-8826-0a1142e3813d)


## Important points from requirements doc
- maintain single source of truth for game state and moves
- validate on client and server side
- calculate and display valid moves
- study and balance game dynamics when hero 3 is added
- open-closed principle
