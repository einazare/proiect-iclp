import java.io.*;
import java.net.*;

public class ReadThread extends Thread {
  private BufferedReader reader;
  private Socket socket;
  private Client client;

  public ReadThread(Socket socket, Client client) {
    this.socket = socket;
    this.client = client;

    try {
      InputStream input = socket.getInputStream();
      reader = new BufferedReader(new InputStreamReader(input));
    } catch (IOException ex) {
      System.out.println("Error getting input stream: " + ex.getMessage());
      ex.printStackTrace();
    }
  }

  public void run() {
    System.out.println(reader != null);
    while (true) {
      try {
        String response = reader.readLine();
        System.out.println("\n" + response);
      } catch (IOException ex) {
        System.out.println("Error reading from server: " + ex.getMessage());
        ex.printStackTrace();
        break;
      }
    }
  }
}
