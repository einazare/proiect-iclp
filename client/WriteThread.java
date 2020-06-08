import java.io.*;
import java.net.*;

public class WriteThread extends Thread {
  private PrintWriter writer;
  private Socket socket;
  private Client client;

  public WriteThread(Socket socket, Client client) {
    this.socket = socket;
    this.client = client;

    try {
      OutputStream output = socket.getOutputStream();
      writer = new PrintWriter(output, true);
    } catch (IOException ex) {
      System.out.println("Error getting output stream: " + ex.getMessage());
      ex.printStackTrace();
    }
  }

  public void run() {

    Console console = System.console();

    String text;

    do {
      text = console.readLine();
      writer.println(text);

    } while (true);
  }
}
