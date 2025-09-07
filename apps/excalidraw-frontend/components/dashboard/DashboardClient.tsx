'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Pencil, Plus, Grid3X3, Calendar, Users, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { Board, createBoard, deleteBoardById } from '@/lib/api/boards';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';


interface DashboardClientProps {
  initialBoards: Board[];
}

export const DashboardClient = ({ initialBoards }: DashboardClientProps) => {
  const [boards, setBoards] = useState<Board[]>(initialBoards);
  const [newBoardName, setNewBoardName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState<string | null>(null);
  const [createBoardLoading, setCreateBoardLoading ] = useState(false);
  const router = useRouter();
  const { userId, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && userId) {
      const pendingInvitation = localStorage.getItem('pendingInvitation');
      if (pendingInvitation) {
        localStorage.removeItem('pendingInvitation');
        router.push(`/join/${pendingInvitation}`);
      } else {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, userId, router]);
  
  const createNewBoard = async () => {
    setCreateBoardLoading(true);
    if (!newBoardName.trim()) {
      toast.error('Please enter a board name');
      setCreateBoardLoading(false);
      return;
    }
    if(boards.find(board => board.slug === newBoardName.trim())){
      toast.error('Board name already exists');
      setCreateBoardLoading(false);
      return;
    }

    try {
      const newBoard = await createBoard(newBoardName);
      console.log(newBoard);

      if(newBoard?.status === 200){
        setCreateBoardLoading(false);
        setBoards([...boards, newBoard.data]);
        setNewBoardName('');
        setIsDialogOpen(false);
        toast.success('New board created successfully!');
      }
    } catch (error) {
      setCreateBoardLoading(false);
      setNewBoardName('');
      toast.error(`${error}`);
    }

  };

  const deleteBoard =async (boardId: string) => {
    setBoardToDelete(null);
    const res = await deleteBoardById(boardId);
    if(res?.status === 200){
      setBoards(boards.filter(board => board.id !== boardId));
      toast.success('Board deleted successfully!');
    }else{
      toast.error('Error deleting board');
    }
  }


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-[#006239] text-white hover:opacity-80 [box-shadow:0_-3px_8px_0_#ffffff60_inset]">
              <Plus size={16} />
              New Board
            </Button>
          </DialogTrigger>
          <DialogContent className="border-[#006239] border-dashed bg-black">
            <DialogHeader>
              <DialogTitle>Create New Whiteboard</DialogTitle>
              <DialogDescription>
                Give your whiteboard a name to get started.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="boardName">Board Name</Label>
              <Input
                id="boardName"
                placeholder="My Awesome Whiteboard"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                className="mt-2 border-dashed focus-visible:ring-[#006239] focus-visible:ring-1"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className='border-dashed'>
                Cancel
              </Button>
              <Button disabled={createBoardLoading} onClick={createNewBoard} className="bg-[#006239] hover:bg-[#006239] text-white">
                { createBoardLoading ? 'Creating...' : 'Create Board' }
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create new board card */}
        <motion.div
          whileHover={{ y: -6 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className="h-full bg-black border-dashed border-[#006239] hover:border-[#009758] cursor-pointer hover:bg-[#00975820]  transition-colors">
            <CardContent className="flex flex-col items-center justify-center h-64">
              <div onClick={()=>{
                setIsDialogOpen(true);
              }} className="h-20 w-20 border border-dashed border-[#202020]  flex items-center justify-center text-white ">
                <Plus className="h-10 w-10 text-[#009758]" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-[#009758]">Create New Board</h3>
              <p className="text-sm text-neutral-400 mt-1 text-sm text-center">
                Start with a blank whiteboard
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Existing boards */}
        {boards.map((board: Board, index) => (
          <motion.div 
            key={index}
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className=''
          >
            <Card className="h-full cursor-pointer border-[#006239] border-dashed hover:border-[#009758] transition-all py-0 overflow-hidden group bg-black">
              <CardHeader className=" px-4 pt-4 !pb-3 border-b border-dashed border-[#006239]">
                <CardTitle className="text-[#009758] text-xl capitalize">{board.slug}</CardTitle>
                <CardDescription className='text-sm text-neutral-400'>
                  Last updated {formatDate(board.updatedAt)}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="h-32 bg-black flex items-center justify-center overflow-hidden relative">
                  <Grid3X3 strokeWidth={0.5}  className="h-32 w-32 text-neutral-500 z-20 " />
                </div>
              </CardContent>
              <CardFooter className="flex border border-dashed border-[#202020] m-1 justify-between bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/10 dark:to-purple-900/10 p-1 px-2">
                <div className="flex items-center text-sm text-muted-foreground gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar strokeWidth={0.8} size={16} className="text-[#009758]" />
                    <span className='text-xs text-neutral-300 font-light'>{formatDate(board.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users strokeWidth={0.8} size={16} className="text-[#009758]" />
                    <span className='text-xs text-neutral-300 font-light'>{board.collaborators ? board.collaborators.length : 0}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <AlertDialog open={boardToDelete === board.id} onOpenChange={(isOpen) => !isOpen && setBoardToDelete(null)}>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-800 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/50 "
                        onClick={(e) => {
                          e.stopPropagation();
                          setBoardToDelete(board.id);
                        }}
                      >
                        <Trash2 size={16} strokeWidth={0.8} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the board
                          and all of its contents.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setBoardToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteBoard(board.id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-[#006239] hover:text-[#009758] hover:bg-[#009758] text-[#009758]  font-light font-sm"
                    onClick={() => router.push(`/canvas/${board.id}`)}
                  >
                    <Pencil size={16} strokeWidth={0.8} className="text-[#009758]" /> Open
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};