-- AlterTable: make User.name unique
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");
