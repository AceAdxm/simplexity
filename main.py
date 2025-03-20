# Simplexity Music Player

import os
import tkinter as tk
from tkinter import filedialog, messagebox
from mutagen.mp3 import MP3
import pygame

class Simplexity:
    def __init__(self, root):
        self.root = root
        self.root.title("Simplexity Music Player")
        self.root.geometry("800x600")
        
        self.playlist = []
        self.current_song = None
        
        self.create_widgets()
        pygame.mixer.init()

    def create_widgets(self):
        self.logo = tk.Label(self.root, text="Simplexity", font=("Cursive", 24))
        self.logo.pack(pady=10)

        self.play_button = tk.Button(self.root, text="Play", command=self.play_song)
        self.play_button.pack(pady=5)

        self.pause_button = tk.Button(self.root, text="Pause", command=self.pause_song)
        self.pause_button.pack(pady=5)

        self.stop_button = tk.Button(self.root, text="Stop", command=self.stop_song)
        self.stop_button.pack(pady=5)

        self.import_button = tk.Button(self.root, text="Import MP3", command=self.import_mp3)
        self.import_button.pack(pady=5)

        self.playlist_box = tk.Listbox(self.root)
        self.playlist_box.pack(pady=10, fill=tk.BOTH, expand=True)

    def import_mp3(self):
        files = filedialog.askopenfilenames(filetypes=[("MP3 Files", "*.mp3")])
        for file in files:
            self.playlist.append(file)
            self.playlist_box.insert(tk.END, os.path.basename(file))

    def play_song(self):
        if self.playlist_box.curselection():
            self.current_song = self.playlist_box.curselection()[0]
            pygame.mixer.music.load(self.playlist[self.current_song])
            pygame.mixer.music.play()

    def pause_song(self):
        pygame.mixer.music.pause()

    def stop_song(self):
        pygame.mixer.music.stop()

if __name__ == "__main__":
    root = tk.Tk()
    app = Simplexity(root)
    root.mainloop()
